import {Component, computed, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

import {LearningPreferences} from "../../../../types/user details/learning-preferences.enum";
import {MeetingPreferences} from "../../../../types/user details/mentor/mentor.enum";
import {NeurodivergenceConditions} from "../../../../types/user details/neurodivergence.enum";

import {TextAreaInputComponent} from "../../../../shared/component/textarea-input/text-area-input.component";
import {TextInputComponent} from "../../../../shared/component/text-input/text-input.component";
import {Router} from "@angular/router";
import {RegistrationService} from "../../../register/registration.service";
import {MenteeDetailsFormControls} from "../../../../types/user details/mentee-details-form.interface";
import {minLengthArray} from "../../../../shared/helpers/minArrayLengthFormControlValidation";
import {atLeastOneTrueValidator} from "../../../../shared/helpers/atLeastOneSelectedCheckboxValidation";
import {
  EditMenteeDetailsComponent
} from "../../../../shared/component/edit-mentee-details/edit-mentee-details.component";
import {MenteeInfo, MentorInfo} from "../../../../types/user details/user-info.interface";
import {MentorService} from "../../../../shared/services/user/mentor.service";
import {UserService} from "../../../../shared/services/user/user-service.service";
import {MenteeService} from "../../../../shared/services/user/mentee.service";
import {delay, forkJoin, map, Subscription, switchMap} from "rxjs";
import {UserType} from "../../../../types/user-type.enum";
import mapMenteeDetailsToApiPayload from "../../../../shared/mapper/menteeDetailsToApi.mapper";
import {HttpService} from "../../../../shared/services/http.service";
import {MentorDetails} from "../../../../types/user details/mentor/mentor.interface";
import {MenteeDetails} from "../../../../types/user details/mentee.interface";

@Component({
  selector: 'app-edit-mentee-details-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    EditMenteeDetailsComponent
  ],
  providers: [
    UserService,
    MenteeService,
  ],
  templateUrl: './edit-mentee-details-page.component.html',
  styleUrl: './edit-mentee-details-page.component.scss'
})

export class EditMenteeDetailsPageComponent implements OnInit, OnDestroy {
  private readonly _router = inject(Router);
  private readonly _formBuilder = inject(FormBuilder);

  private readonly _subscriptions: Subscription = new Subscription();

  private readonly menteeService = inject(MenteeService);
  private readonly userService = inject(UserService);
  private readonly apiService = inject(HttpService);

  learningPreferenceOptions = Object.values(LearningPreferences);
  meetingPreferenceOptions = Object.values(MeetingPreferences);
  neurodivergentConditionOptions = Object.values(NeurodivergenceConditions);

  menteeDetails: MenteeDetails = {} as MenteeDetails;

  mentee!: MenteeInfo;

  $menteeDetailsForm!: WritableSignal<FormGroup<MenteeDetailsFormControls>>;


    ngOnInit(): void {
    this._subscriptions.add(
      this.menteeService.menteeDetails().subscribe(( mentoDetails) => {
        this.menteeDetails = mentoDetails;
      }));

      this.mentee = {
        goals: this.menteeDetails.goals,
        description: this.menteeDetails.description,
        learningPreferences: this.menteeDetails.learningPreferences,
        expectations: this.menteeDetails.expectations,
        neurodivergentConditions: this.menteeDetails.neurodivergentConditions,
        meetingPreferences: this.menteeDetails.meetingPreferences,
        commitment: this.menteeDetails.commitment
      };

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

    this._subscriptions.add(
      this.userService.userDetails().pipe(
        switchMap((userDetails) => {
          const menteeDetailsEndpoint = 'users/mentee-details/';

          if (userDetails.roles.includes(UserType.MENTEE)) {
            return this.menteeService.updateMenteeDetails({...menteeDetailsToUpdate, id: this.menteeDetails.id}).pipe(
              map(() => userDetails)
            );
          } else {
            const payload = mapMenteeDetailsToApiPayload(menteeDetailsToUpdate, userDetails.id);
            return this.apiService.post(menteeDetailsEndpoint, payload).pipe(
              map(() => userDetails)
            )
          }
        }),
        switchMap((userDetails) => {
          const { email, id, joined, profilePic, ...details } = userDetails;
          return this.userService.updateUserDetails({...details, roles: [...details.roles, UserType.MENTEE]});
        }),
        delay(500),
      ).
      subscribe(() => this.navigateToDetails())
    );

  }

  ngOnDestroy(): void {
      this._subscriptions.unsubscribe();
  }

  navigateToDetails() {
    this._router.navigate(['/profile/mentee-details']);
  }

}
