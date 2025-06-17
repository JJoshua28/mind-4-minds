import {Component, inject, signal, WritableSignal} from '@angular/core';
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
import { MenteeInfo } from "../../../../types/user details/user-info.interface";

@Component({
  selector: 'app-edit-mentee-details-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TextAreaInputComponent,
    TextInputComponent,
    EditMenteeDetailsComponent
  ],
  templateUrl: './edit-mentee-details-page.component.html',
  styleUrl: './edit-mentee-details-page.component.scss'
})

export class EditMenteeDetailsPageComponent {
  private readonly _router = inject(Router);
  private readonly _formBuilder = inject(FormBuilder);

  private readonly registrationService: RegistrationService = inject(RegistrationService);

  learningPreferenceOptions = Object.values(LearningPreferences);
  meetingPreferenceOptions = Object.values(MeetingPreferences);
  neurodivergentConditionOptions = Object.values(NeurodivergenceConditions);

  mentee: MenteeInfo = this.registrationService.menteeDetails;

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
    const learningPreferences: LearningPreferences[] = this.learningPreferenceOptions.filter((value, index) => this.$menteeDetailsForm()?.value?.learningPreferences?.[index]);
    const meetingPreferences: MeetingPreferences[] = this.meetingPreferenceOptions.filter((value, index) => this.$menteeDetailsForm()?.value?.meetingPreferences?.[index]);
    const neurodivergentConditions: NeurodivergenceConditions[] = this.neurodivergentConditionOptions.filter((value, index) => this.$menteeDetailsForm()?.value?.neurodivergentConditions?.[index]);


    const details = {
      ...this.$menteeDetailsForm().value,
      learningPreferences,
      meetingPreferences,
      neurodivergentConditions
    }as MenteeInfo

    this.registrationService.addMenteeDetails(details);
  }


  cancelEdit() {
    this._router.navigate(['/profile/mentee-details']);
  }

}
