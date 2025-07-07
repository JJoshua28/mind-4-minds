import {Component, inject, input, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

import {LearningPreferences} from "../../../../types/user details/learning-preferences.enum";
import {MeetingPreferences} from "../../../../types/user details/mentor/mentor.enum";
import {NeurodivergenceConditions} from "../../../../types/user details/neurodivergence.enum";

import {Router} from "@angular/router";

import {MenteeDetailsFormControls} from "../../../../types/user details/mentee-details-form.interface";
import {minLengthArray} from "../../../../shared/helpers/minArrayLengthFormControlValidation";
import {atLeastOneTrueValidator} from "../../../../shared/helpers/atLeastOneSelectedCheckboxValidation";
import {
  EditMenteeDetailsComponent
} from "../../../../shared/component/edit-mentee-details/edit-mentee-details.component";
import {MenteeInfo } from "../../../../types/user details/user-info.interface";
import {UserService} from "../../../../shared/services/user/user-service.service";

import { map, of, Subscription, switchMap, take, tap} from "rxjs";
import {UserType} from "../../../../types/user-type.enum";
import mapMenteeDetailsToApiPayload from "../../../../shared/mapper/menteeDetailsToApi.mapper";

import {MenteeDetails} from "../../../../types/user details/mentee.interface";
import {UserRepository} from "../../../../shared/repositories/user.repository";
import {MenteeRepository} from "../../../../shared/repositories/mentee.repository";
import { UserDetails} from "../../../../types/user.interface";
import {MenteeDetailsApi} from "../../../../types/api/mentee-details-interface";

@Component({
  selector: 'app-edit-mentee-details-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    EditMenteeDetailsComponent
  ],
  templateUrl: './edit-mentee-details-page.component.html',
  styleUrl: './edit-mentee-details-page.component.scss'
})

export class EditMenteeDetailsPageComponent implements OnInit, OnDestroy {
  private readonly _router = inject(Router);
  private readonly _formBuilder = inject(FormBuilder);

  private readonly _subscriptions: Subscription = new Subscription();

  private readonly menteeRepository = inject(MenteeRepository)
  private readonly userRepository = inject(UserRepository)
  private readonly _userService = inject(UserService)

  learningPreferenceOptions = Object.values(LearningPreferences);
  meetingPreferenceOptions = Object.values(MeetingPreferences);
  neurodivergentConditionOptions = Object.values(NeurodivergenceConditions);

  userDetailsId = input.required<string>()

  menteeDetails: MenteeDetails = {} as MenteeDetails;

  userDetails!: UserDetails;

  mentee: MenteeInfo = {} as MenteeInfo;

  $menteeDetailsForm!: WritableSignal<FormGroup<MenteeDetailsFormControls>>;

  $isReady = signal(false)


    ngOnInit(): void {
    this._subscriptions.add(
      this.menteeRepository.menteeUser(this.userDetailsId()).pipe(
        switchMap((menteeUser) => {
          if (menteeUser.id) {
            this.userDetails = {
              id: menteeUser.id,
              firstName: menteeUser.firstName,
              lastName: menteeUser.lastName,
              email: menteeUser.email,
              occupation: menteeUser.occupation,
              occupationStartDate: menteeUser.occupationStartDate,
              profilePic: menteeUser.profilePic,
              roles: menteeUser.roles,
              joined: menteeUser.joined,
              isArchived: menteeUser.isArchived,
              isAdmin: menteeUser.isAdmin,
              accountId: menteeUser.accountId
            };

            this.menteeDetails = menteeUser.menteeDetails;
            this.mentee = {
              goals: this.menteeDetails.goals,
              description: this.menteeDetails.description,
              learningPreferences: this.menteeDetails.learningPreferences,
              expectations: this.menteeDetails.expectations,
              neurodivergentConditions: this.menteeDetails.neurodivergentConditions,
              meetingPreferences: this.menteeDetails.meetingPreferences,
              commitment: this.menteeDetails.commitment
            };

            return of(menteeUser);
          } else {
            return this.userRepository.getUserDetailsById(this.userDetailsId()).pipe(
              map((userDetails) => {
                this.userDetails = userDetails;
                return userDetails;
              })
            );
          }
        })
      ).subscribe(() => {
        this.$menteeDetailsForm = signal(this._formBuilder.group({
          description: this._formBuilder.nonNullable.control(this.mentee?.description || "", [Validators.required]),
          goals: this._formBuilder.array(
            this.mentee?.goals?.length > 0 ?
              this.mentee.goals.map(goal => this._formBuilder.nonNullable.control(goal)) : [],
            minLengthArray(1)
          ),
          learningPreferences: this._formBuilder.array(
            this.learningPreferenceOptions.map(preference => {
              const defaultValue = this.mentee?.learningPreferences?.includes(preference) || false;
              return this._formBuilder.nonNullable.control(defaultValue)
            }),
            {validators: [atLeastOneTrueValidator]
            }
          ),
          expectations: this._formBuilder.control(this.mentee?.expectations || ""),
          neurodivergentConditions: this._formBuilder.array(
            this.neurodivergentConditionOptions.map(condition => {
              const defaultValue = this.mentee?.neurodivergentConditions?.includes(condition) || false;
              return this._formBuilder.nonNullable.control(defaultValue)
            })
          ),
          meetingPreferences: this._formBuilder.array(
            this.meetingPreferenceOptions.map(preference => {
              const defaultValue = this.mentee?.meetingPreferences?.includes(preference) || false;
              return this._formBuilder.nonNullable.control(defaultValue)
            }),
            {validators: [atLeastOneTrueValidator]
            }
          ),
          commitment: this._formBuilder.nonNullable.control(this.mentee?.commitment || "", [Validators.required]),
        }))
        this.$isReady.set(true);
      })
    );

  }

  submitMenteeDetails() {
    const learningPreferences: LearningPreferences[] = this.learningPreferenceOptions.filter((value, index) => this.$menteeDetailsForm()?.value?.learningPreferences?.[index]);
    const meetingPreferences: MeetingPreferences[] = this.meetingPreferenceOptions.filter((value, index) => this.$menteeDetailsForm()?.value?.meetingPreferences?.[index]);
    const neurodivergentConditions: NeurodivergenceConditions[] = this.neurodivergentConditionOptions.filter((value, index) => this.$menteeDetailsForm()?.value?.neurodivergentConditions?.[index]);

    const menteeDetailsToUpdate: MenteeInfo = {
      ...this.$menteeDetailsForm().value,
      learningPreferences,
      meetingPreferences,
      neurodivergentConditions
    } as MenteeInfo;

    const {profilePic, ...userDetailsToUpdate} = this.userDetails;

    this._subscriptions.add(
      this.userDetails.roles.includes(UserType.MENTEE) ?
      this.menteeRepository.updateMenteeDetails({...menteeDetailsToUpdate, id: this.menteeDetails.id}).pipe(
        take(1),
      ).subscribe(() => this.navigateToDetails()) :

      this.userRepository.updateUserDetails({
        ...userDetailsToUpdate,
        roles: [...this.userDetails.roles, UserType.MENTEE]
      },
        this.userDetails.id
      ).pipe(
        tap((user) => {
          this.userDetails = {
            id: user.id,
            accountId: user.accountId,
            joined: user.joined,
            isArchived: user.isArchived,
            profilePic: user.profilePic,
            roles: user.roles,
            email: user.email,
            isAdmin: user.isAdmin,
            firstName: user.firstName,
            lastName: user.lastName,
            occupation: user.occupation,
            occupationStartDate: user.occupationStartDate
          }

        }),
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
            })
          }
        }),
        switchMap(() => {
          const menteeDetailsPayload = mapMenteeDetailsToApiPayload(menteeDetailsToUpdate, this.userDetails.id) as MenteeDetailsApi;
          return this.menteeRepository.createMentee(menteeDetailsPayload)
        }),
        take(1),
      ).subscribe(() => this.navigateToDetails())
    );
  }

  ngOnDestroy(): void {
      this._subscriptions.unsubscribe();
  }

  navigateToDetails() {
      const route = this.userDetails.roles.includes(UserType.MENTEE) ? 'mentee-details' : 'user-details';
      const detailsUrl = `/${route}/${this.userDetails.id}`;
      this._router.navigate([detailsUrl]);
  }

}
