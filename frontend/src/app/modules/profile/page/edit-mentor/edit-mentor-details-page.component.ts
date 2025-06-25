import {Component, computed, inject, OnDestroy, OnInit, Signal, signal, ViewChild, WritableSignal} from '@angular/core';
import {TextAreaInputComponent} from "../../../../shared/component/textarea-input/text-area-input.component";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MeetingPreferences } from "../../../../types/user details/mentor/mentor.enum";
import {TitleCasePipe} from "@angular/common";
import {
  EditMentorDetailsComponent
} from "../../../../shared/component/edit-mentor-details/edit-mentor-details.component";
import {RegistrationService} from "../../../register/registration.service";
import {NeurodivergenceConditions} from "../../../../types/user details/neurodivergence.enum";
import {delay, forkJoin, map, Subscription, switchMap, take} from "rxjs";
import {MentorInfo, UserInfo} from "../../../../types/user details/user-info.interface";
import {MentorDetailsFormControl} from "../../../../types/user details/mentor/mentor-details-form.interface";
import {atLeastOneTrueValidator} from "../../../../shared/helpers/atLeastOneSelectedCheckboxValidation";
import {PreviewMentorCardComponent} from "../../components/preview-mentor-card/preview-mentor-card.component";
import {MentorService} from "../../../../shared/services/user/mentor.service";
import {UserService} from "../../../../shared/services/user/user-service.service";
import {MentorDetails} from "../../../../types/user details/mentor/mentor.interface";
import {UserType} from "../../../../types/user-type.enum";
import {mapMentorDetailsToApiPayload} from "../../../../shared/mapper/mentorDetailsToApi.mapper";
import {HttpService} from "../../../../shared/services/http.service";

@Component({
  selector: 'app-edit-mentor-details-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    EditMentorDetailsComponent,
    PreviewMentorCardComponent
  ],
  providers: [
    UserService,
    MentorService
  ],
  templateUrl: './edit-mentor-details-page.component.html',
  styleUrl: './edit-mentor-details-page.component.scss'
})

export class EditMentorDetailsPageComponent implements OnInit, OnDestroy {
  private readonly _router = inject(Router);
  private readonly _formBuilder = inject(FormBuilder);

  @ViewChild(PreviewMentorCardComponent) previewMentorModal!: PreviewMentorCardComponent;

  private readonly subscriptions: Subscription = new Subscription();

  private readonly mentorService = inject(MentorService);
  private readonly userService = inject(UserService);
  private readonly apiService = inject(HttpService);

  meetingPreferenceOptions = Object.values(MeetingPreferences);
  neurodivergentConditionOptions = Object.values(NeurodivergenceConditions);

  mentorDetails!: MentorInfo;

  $user!:Signal<UserInfo & MentorInfo>;

  $mentorDetailsForm!: WritableSignal<FormGroup<MentorDetailsFormControl>>;

  ngOnInit() {
    this.subscriptions.add(
      forkJoin([this.userService.userInfo(), this.mentorService.mentorInfo()]).subscribe(([userInfo, mentorInfo]) => {
        this.mentorDetails = mentorInfo;

        this.$mentorDetailsForm = signal(this._formBuilder.group({
          description: this._formBuilder.nonNullable.control(this.mentorDetails?.description || "", [Validators.required]),
          qualifications: this._formBuilder.nonNullable.control(this.mentorDetails?.qualifications || "", [Validators.required]),
          commitment: this._formBuilder.nonNullable.control(this.mentorDetails?.commitment || "", [Validators.required]),
          experience: this._formBuilder.nonNullable.control(this.mentorDetails?.experience || ""),
          meetingPreferences: this._formBuilder.nonNullable.array(
            this.meetingPreferenceOptions.map(preference => {
              const defaultValue = this.mentorDetails?.meetingPreferences?.includes(preference);
              return this._formBuilder.nonNullable.control(defaultValue)
            }),
            { validators: [atLeastOneTrueValidator] }
          ),
          neurodivergentConditions: this._formBuilder.nonNullable.array(
            this.neurodivergentConditionOptions.map(condition => {
              const defaultValue = this.mentorDetails?.neurodivergentConditions?.includes(condition);
              return this._formBuilder.nonNullable.control(defaultValue)
            })
          ),
        }));

        this.$user = computed(() => {
          const meetingPreferences: MeetingPreferences[] = this.meetingPreferenceOptions.filter(
            (value, index) => this.$mentorDetailsForm().value?.meetingPreferences?.[index]
          );
          const neurodivergentConditions: NeurodivergenceConditions[] = this.neurodivergentConditionOptions.filter(
            (value, index) => this.$mentorDetailsForm().value?.neurodivergentConditions?.[index]
          );
          const mentorInfo = {
            ...this.$mentorDetailsForm().value as Partial<MentorInfo>,
            meetingPreferences,
            neurodivergentConditions,
          } as MentorInfo;


          return {
            ...userInfo,
            profilePic: userInfo.profilePic || "/assets/images/default.jpeg",
            ...mentorInfo,
          };
        });

        this.subscriptions.add(
          this.$mentorDetailsForm().valueChanges.subscribe(() => {
          })
        );
      })
    );
  }

  updateMentorDetails() {
    if (this.$mentorDetailsForm().valid) {
      const meetingPreferences = this.meetingPreferenceOptions.filter((value, index) => this.$mentorDetailsForm()?.value?.meetingPreferences?.[index]);
      const neurodivergentConditions = this.neurodivergentConditionOptions.filter((value, index) => this.$mentorDetailsForm()?.value?.neurodivergentConditions?.[index]);

      const formData = {
        ...this.$mentorDetailsForm().value as Partial<MentorDetails>,
        meetingPreferences: meetingPreferences,
        neurodivergentConditions: neurodivergentConditions,
      }

      this.subscriptions.add(
        this.userService.userDetails().pipe(
          switchMap((userDetails) => {
            const mentorDetailsEndpoint = 'users/mentor-details/';

            if (userDetails.roles.includes(UserType.MENTOR)) {
              return this.mentorService.updateMentorDetails(formData as Partial<MentorDetails>).pipe(
                map(() => userDetails) // Pass userDetails to next step
              );
            } else {
              const mentorDetailsPayload = mapMentorDetailsToApiPayload(formData, userDetails.id);
              return this.apiService.post(mentorDetailsEndpoint, mentorDetailsPayload).pipe(
                map(() => {
                  return {
                    ...userDetails,
                    roles: [...userDetails.roles, UserType.MENTOR]
                  };
                })
              );
            }
          }),
          switchMap((updatedUserDetails) => {
            const { email, id, joined, profilePic, ...details } = updatedUserDetails;
            return this.userService.updateUserDetails({...details, roles: [...updatedUserDetails.roles, UserType.MENTOR]});
          }),
          delay(300),
        ).subscribe(() =>  this.navigateTo())
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  navigateTo() {
    this._router.navigate(['/profile/mentor-details']);
  }

}
