import {
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core';

import {Router} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MeetingPreferences } from "../../../../types/user details/mentor/mentor.enum";

import {
  EditMentorDetailsComponent
} from "../../../../shared/component/edit-mentor-details/edit-mentor-details.component";

import {NeurodivergenceConditions} from "../../../../types/user details/neurodivergence.enum";
import {delay, map, of, Subscription, switchMap, take} from "rxjs";
import {MentorInfo, UserInfo} from "../../../../types/user details/user-info.interface";
import {MentorDetailsFormControl} from "../../../../types/user details/mentor/mentor-details-form.interface";
import {atLeastOneTrueValidator} from "../../../../shared/helpers/atLeastOneSelectedCheckboxValidation";
import {PreviewMentorCardComponent} from "../../components/preview-mentor-card/preview-mentor-card.component";

import {MentorDetails} from "../../../../types/user details/mentor/mentor.interface";
import {UserType} from "../../../../types/user-type.enum";
import {
  mapMentorDetailsToApiPayload,
} from "../../../../shared/mapper/mentorDetailsToApi.mapper";

import {UserDetails} from "../../../../types/user.interface";
import {UserRepository} from "../../../../shared/repositories/user.repository";
import {MentorRepository} from "../../../../shared/repositories/mentor.repository.service";

import {MentorDetailsApi} from "../../../../types/api/mentor-details.interface";
import {UserService} from "../../../../shared/services/user/user-service.service";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-edit-mentor-details-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    EditMentorDetailsComponent,
    PreviewMentorCardComponent
  ],
  templateUrl: './edit-mentor-details-page.component.html',
  styleUrl: './edit-mentor-details-page.component.scss'
})

export class EditMentorDetailsPageComponent implements OnInit, OnDestroy {
  private readonly _router = inject(Router);
  private readonly _formBuilder = inject(FormBuilder);

  private readonly _userRepository = inject(UserRepository)
  private readonly _mentorRepository = inject(MentorRepository)
  private readonly _userService = inject(UserService)

  @ViewChild(PreviewMentorCardComponent) previewMentorModal!: PreviewMentorCardComponent;

  private readonly subscriptions: Subscription = new Subscription();

  userDetailsId = input.required<string>();

  meetingPreferenceOptions = Object.values(MeetingPreferences);
  neurodivergentConditionOptions = Object.values(NeurodivergenceConditions);

  mentorInfo: MentorInfo = {} as MentorInfo;
  mentorDetails: MentorDetails = {} as MentorDetails;

  userDetails: UserDetails = {} as UserDetails;

  $dataIsReady = signal(false);

  $user!:Signal<UserInfo & MentorInfo>;

  $mentorDetailsForm!: Signal<FormGroup<MentorDetailsFormControl>>;

  ngOnInit() {
    this.subscriptions.add(
      this._mentorRepository.mentorUser(this.userDetailsId()).pipe(
        take(1),
        map((mentorUser) => {
          const { mentorDetails, ...userDetails } = mentorUser;
          this.mentorInfo = {
            description: mentorDetails?.description,
            experience: mentorDetails?.experience,
            commitment: mentorDetails?.commitment,
            qualifications: mentorDetails?.qualifications,
            meetingPreferences: mentorDetails?.meetingPreferences,
            neurodivergentConditions: mentorDetails?.neurodivergentConditions
          };
          this.userDetails = userDetails;
          this.mentorDetails = mentorDetails;
          return mentorUser;
        })
      ).subscribe(() => {
        this.buildForm();
        this.$dataIsReady.set(true);
      })
    );

    if (!this.userDetails.id) {
      this.subscriptions.add(
        this._userRepository.getUserDetailsById(this.userDetailsId()).subscribe((userDetails) => {
          this.userDetails = userDetails;
          this.buildForm();
          this.$dataIsReady.set(true);
        })
      );
    }
  }

  private computedUser(): Signal<UserInfo & MentorInfo> {
    return computed(() => {
      const meetingPreferences: MeetingPreferences[] = this.meetingPreferenceOptions.filter(
        (value, index) => this.$mentorDetailsForm()?.value?.meetingPreferences?.[index]
      );
      const neurodivergentConditions: NeurodivergenceConditions[] = this.neurodivergentConditionOptions.filter(
        (value, index) => this.$mentorDetailsForm()?.value?.neurodivergentConditions?.[index]
      );
      const mentorInfo = {
        ...this.$mentorDetailsForm()?.value as Partial<MentorInfo>,
        meetingPreferences,
        neurodivergentConditions,
      } as MentorInfo;

      const userInfo = {
        firstName: this.userDetails?.firstName,
        lastName: this.userDetails?.lastName,
        email: this.userDetails?.email,
        occupation: this.userDetails?.occupation || null,
        occupationStartDate: this.userDetails?.occupationStartDate || null,
        profilePic: this.userDetails?.profilePic || null
      } as UserInfo;

      return {
        ...userInfo,
        ...mentorInfo,
      };
    })
  }

  private buildForm() {
    this.$mentorDetailsForm = signal(this._formBuilder.group({
      description: this._formBuilder.nonNullable.control(this.mentorInfo?.description || "", [Validators.required]),
      qualifications: this._formBuilder.nonNullable.control(this.mentorInfo?.qualifications || "", [Validators.required]),
      commitment: this._formBuilder.nonNullable.control(this.mentorInfo?.commitment || "", [Validators.required]),
      experience: this._formBuilder.nonNullable.control(this.mentorInfo?.experience || ""),
      meetingPreferences: this._formBuilder.nonNullable.array(
        this.meetingPreferenceOptions.map(preference => {
          const defaultValue = this.mentorInfo?.meetingPreferences?.includes(preference);
          return this._formBuilder.nonNullable.control(defaultValue)
        }),
        { validators: [atLeastOneTrueValidator] }
      ),
      neurodivergentConditions: this._formBuilder.nonNullable.array(
        this.neurodivergentConditionOptions.map(condition => {
          const defaultValue = this.mentorInfo?.neurodivergentConditions?.includes(condition);
          return this._formBuilder.nonNullable.control(defaultValue)
        })
      ),
    }));

    this.$user = this.computedUser();

    this.subscriptions.add(
      this.$mentorDetailsForm().valueChanges.subscribe(() => {
        this.$user = this.computedUser();
      })
    );
  }

  updateMentorDetails() {
    if (this.$mentorDetailsForm().valid) {
      const meetingPreferences = this.meetingPreferenceOptions.filter((value, index) => this.$mentorDetailsForm()?.value?.meetingPreferences?.[index]);
      const neurodivergentConditions = this.neurodivergentConditionOptions.filter((value, index) => this.$mentorDetailsForm()?.value?.neurodivergentConditions?.[index]);

      const formData = {
        ...this.mentorInfo,
        ...this.$mentorDetailsForm().value as Partial<MentorDetails>,
        meetingPreferences: meetingPreferences,
        neurodivergentConditions: neurodivergentConditions,
      }

      const {profilePic, ...userDetailsToUpdate} = this.userDetails;


      this.subscriptions.add(
        this.userDetails.roles.includes(UserType.MENTOR) ?
          this._mentorRepository.updateMentorDetails(
            {
              ...this.mentorDetails,
              ...formData
            }).pipe(
            take(1),
          ).subscribe(() => this.navigateToDetails()) :

          this._userRepository.updateUserDetails({
              ...userDetailsToUpdate,
              roles: [...userDetailsToUpdate.roles, UserType.MENTOR]
            },
            this.userDetails.id
          ).pipe(
            map((user) => {
              if(this._userService.$userDetails().id === this.userDetailsId())
              {
                this._userService.updateData({
                  id: user.id,
                  profilePic: user.profilePic,
                  roles: user.roles,
                  email: user.email,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  occupation: user.occupation,
                  occupationStartDate: user.occupationStartDate
                });
              }
            }),
            switchMap(() => {
              const mentorDetailsPayload = mapMentorDetailsToApiPayload(formData, this.userDetails.id) as MentorDetailsApi;
              return this._mentorRepository.createMentor(mentorDetailsPayload)
            }),
            take(1),
          ).subscribe(() => this.navigateToDetails())
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  navigateToDetails() {
    const route = this.userDetails.roles.includes(UserType.MENTOR) ?
      `/mentor-details/${this.userDetails.id}` : `/user-details/${this.userDetails.id}`;

    this._router.navigate([route]);
  }

}
