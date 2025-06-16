import {Component, inject, input, InputSignal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TextAreaInputComponent} from "../textarea-input/text-area-input.component";
import {TextInputComponent} from "../text-input/text-input.component";

import {LearningPreferences} from "../../../types/user details/learning-preferences.enum";
import {MeetingPreferences} from "../../../types/user details/mentor/mentor.enum";
import {NeurodivergenceConditions} from "../../../types/user details/neurodivergence.enum";

import {MenteeDetailsFormControls} from "../../../types/user details/mentee-details.interface";

@Component({
  selector: 'app-edit-mentee-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TextAreaInputComponent,
    TextInputComponent
  ],
  templateUrl: './edit-mentee-details.component.html',
  styleUrl: './edit-mentee-details.component.scss'
})
export class EditMenteeDetailsComponent {
  private readonly _formBuilder = inject(FormBuilder);

  learningPreferenceOptions = Object.values(LearningPreferences);
  meetingPreferenceOptions = Object.values(MeetingPreferences);
  neurodivergentConditionOptions = Object.values(NeurodivergenceConditions);

  $menteeDetailsForm: InputSignal<FormGroup<MenteeDetailsFormControls>> = input.required<FormGroup<MenteeDetailsFormControls>>()

  newGoalControl = this._formBuilder.control('', Validators.required);

  addGoal() {
    const value = this.newGoalControl.value?.trim() as string;
    if (value) {
      this.$menteeDetailsForm().controls.goals.push(
        this._formBuilder.nonNullable.control(value, Validators.required)
      );

      this.newGoalControl.reset();
    }
  }

  removeGoal(index: number) {
    this.$menteeDetailsForm().controls.goals.removeAt(index);
  }

}
