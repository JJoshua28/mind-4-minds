import {Component, inject, signal, WritableSignal} from '@angular/core';
import {
  EditMenteeDetailsComponent
} from "../../../../shared/component/edit-mentee-details/edit-mentee-details.component";
import {LearningPreferences} from "../../../../types/user details/learning-preferences.enum";
import {MeetingPreferences} from "../../../../types/user details/mentor/mentor.enum";
import {NeurodivergenceConditions} from "../../../../types/user details/neurodivergence.enum";
import { MenteeDetails} from "../../../../types/user details/mentee.interface";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MenteeDetailsFormControls} from "../../../../types/user details/mentee-details.interface";
import {minLengthArray} from "../../../../shared/helpers/minArrayLengthFormControlValidation";
import {RegistrationService} from "../../registration.service";
import {Router} from "@angular/router";
import {atLeastOneTrueValidator} from "../../../../shared/helpers/atLeastOneSelectedCheckboxValidation";

@Component({
  selector: 'app-register-mentee-details-page',
  standalone: true,
  imports: [
    EditMenteeDetailsComponent
  ],
  templateUrl: './register-mentee-details-page.component.html',
  styleUrl: './register-mentee-details-page.component.scss'
})
export class RegisterMenteeDetailsPageComponent {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _router = inject(Router);

  private readonly registrationService: RegistrationService = inject(RegistrationService);

  learningPreferenceOptions = Object.values(LearningPreferences);
  meetingPreferenceOptions = Object.values(MeetingPreferences);
  neurodivergentConditionOptions = Object.values(NeurodivergenceConditions);

  mentee: MenteeDetails = this.registrationService.menteeDetails;

  $menteeDetailsForm: WritableSignal<FormGroup<MenteeDetailsFormControls>> = signal(this._formBuilder.group({
    description: this._formBuilder.nonNullable.control(this.mentee?.description || "", [Validators.required]),
    goals: this._formBuilder.array(
      this.mentee?.goals.length > 0 ?
        this.mentee.goals.map(goal => this._formBuilder.nonNullable.control(goal)) : [],
      minLengthArray(1)
    ),
    learningPreferences: this._formBuilder.array(
      this.learningPreferenceOptions.map(preference => {
        const defaultValue = this.mentee?.learningPreferences.includes(preference);
        return this._formBuilder.nonNullable.control(defaultValue)
      }),
      {validators: [atLeastOneTrueValidator]
      }
    ),
    expectations: this._formBuilder.control(this.mentee?.expectations || ""),
    neurodivergentConditions: this._formBuilder.array(
      this.neurodivergentConditionOptions.map(condition => {
        const defaultValue = this.mentee?.neurodivergentConditions.includes(condition);
        return this._formBuilder.nonNullable.control(defaultValue)
      })
    ),
    meetingPreferences: this._formBuilder.array(
      this.meetingPreferenceOptions.map(preference => {
        const defaultValue = this.mentee?.meetingPreferences.includes(preference);
        return this._formBuilder.nonNullable.control(defaultValue)
      }),
      {validators: [atLeastOneTrueValidator]
      }
    ),
    commitment: this._formBuilder.nonNullable.control(this.mentee?.commitment || "", [Validators.required]),
  }));

  submitMenteeDetails() {
    const learningPreferences = this.learningPreferenceOptions.filter((value, index) => this.$menteeDetailsForm()?.value?.learningPreferences?.[index]);
    const meetingPreferences = this.meetingPreferenceOptions.filter((value, index) => this.$menteeDetailsForm()?.value?.meetingPreferences?.[index]);

    const details = this.$menteeDetailsForm().value as Partial<MenteeDetails>;
    this.registrationService.addMenteeDetails({
      ...details,
      learningPreferences,
      meetingPreferences
    } as MenteeDetails);
  }

  navigateToNextSection() {
    const menteeDetailsRegistrationUrl = "login";
    this.$menteeDetailsForm().valid && this._router.navigate([menteeDetailsRegistrationUrl]);
  }

}
