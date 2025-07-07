import {Component, computed, inject, OnDestroy, OnInit, Signal, signal, ViewChild, WritableSignal} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {MentorDetailsFormControl} from "../../../../types/user details/mentor/mentor-details-form.interface";
import {MeetingPreferences} from "../../../../types/user details/mentor/mentor.enum";
import {NeurodivergenceConditions} from "../../../../types/user details/neurodivergence.enum";
import {MentorInfo, UserInfo} from "../../../../types/user details/user-info.interface";

import {RegistrationService} from "../../registration.service";
import {atLeastOneTrueValidator} from "../../../../shared/helpers/atLeastOneSelectedCheckboxValidation";

import {
  EditMentorDetailsComponent
} from "../../../../shared/component/edit-mentor-details/edit-mentor-details.component";
import {
  PreviewMentorCardComponent
} from "../../../profile/components/preview-mentor-card/preview-mentor-card.component";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-register-mentor-details-page',
  standalone: true,
  imports: [
    EditMentorDetailsComponent,
    PreviewMentorCardComponent
  ],
  templateUrl: './register-mentor-details-page.component.html',
  styleUrl: './register-mentor-details-page.component.scss'
})
export class RegisterMentorDetailsPageComponent implements OnInit, OnDestroy {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly registrationService = inject(RegistrationService);

  private readonly subscriptions: Subscription = new Subscription();

  @ViewChild(PreviewMentorCardComponent) previewMentorModal!: PreviewMentorCardComponent;

  meetingPreferenceOptions = Object.values(MeetingPreferences);
  neurodivergentConditionOptions = Object.values(NeurodivergenceConditions);

  mentorDetails: MentorInfo = this.registrationService.mentorDetails();

  $user!:Signal<UserInfo & MentorInfo>;

  $mentorDetailsForm: WritableSignal<FormGroup<MentorDetailsFormControl>> = signal(this._formBuilder.group({
    description: this._formBuilder.nonNullable.control(this.mentorDetails?.description || "", [Validators.required]),
    qualifications: this._formBuilder.nonNullable.control(this.mentorDetails?.qualifications || "", [Validators.required]),
    commitment: this._formBuilder.nonNullable.control(this.mentorDetails?.commitment || "", [Validators.required]),
    experience: this._formBuilder.nonNullable.control(this.mentorDetails?.experience || ""),
    meetingPreferences: this._formBuilder.nonNullable.array(
      this.meetingPreferenceOptions.map(preference => {
        const defaultValue = this.mentorDetails?.meetingPreferences && this.mentorDetails?.meetingPreferences.includes(preference) || false;
        return this._formBuilder.nonNullable.control(defaultValue)
      }),
      {validators: [atLeastOneTrueValidator]
      }
    ),
    neurodivergentConditions: this._formBuilder.nonNullable.array(
      this.neurodivergentConditionOptions.map(condition => {
        const defaultValue = this.mentorDetails?.neurodivergentConditions && this.mentorDetails?.neurodivergentConditions.includes(condition) || false;
        return this._formBuilder.nonNullable.control(defaultValue)
      })
    ),

  }))

  ngOnInit() {
    const userCardInfo  = () => {
      const meetingPreferences: MeetingPreferences[] = this.meetingPreferenceOptions.filter((value, index) => this.$mentorDetailsForm()?.value?.meetingPreferences?.[index]);
      const neurodivergentConditions: NeurodivergenceConditions[] = this.neurodivergentConditionOptions.filter((value, index) => this.$mentorDetailsForm()?.value?.neurodivergentConditions?.[index]);
      const mentorInfo = {
        ...this.$mentorDetailsForm()?.value as Partial<MentorInfo>,
        meetingPreferences,
        neurodivergentConditions,
      } as MentorInfo;

      const userInfo = {
        firstName: this.registrationService.userDetails()?.firstName,
        lastName: this.registrationService.userDetails()?.lastName,
        email: this.registrationService.userDetails()?.email,
        occupation: this.registrationService.userDetails()?.occupation || null,
        occupationStartDate: this.registrationService.userDetails()?.occupationStartDate || null,
        profilePic: this.registrationService.userDetails()?.profilePic && URL.createObjectURL(this.registrationService?.userDetails()?.profilePic as File) || "https://upload.wikimedia.org/wikipedia/commons/b/b5/Windows_10_Default_Profile_Picture.svg",
      } as UserInfo;
      return {
        ...userInfo,
        ...mentorInfo,
      }
    }

    this.$user = computed(() => userCardInfo());


  this.subscriptions.add(
    this.$mentorDetailsForm().valueChanges.subscribe(() => {
      this.$user = computed(() => userCardInfo());
    })
  );
}
  submitRegistrationMentor() {
    const meetingPreferences = this.meetingPreferenceOptions.filter((value, index) => this.$mentorDetailsForm()?.value?.meetingPreferences?.[index]);
    const neurodivergentConditions = this.neurodivergentConditionOptions.filter((value, index) => this.$mentorDetailsForm()?.value?.neurodivergentConditions?.[index]);

    const details = this.$mentorDetailsForm().value as Partial<MentorInfo>;
    this.registrationService.addMentorDetails({
      ...details,
      meetingPreferences,
      neurodivergentConditions
    } as MentorInfo);

    this.registrationService.navigateToNextSection()
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
