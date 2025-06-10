import {Component, inject} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

import {LearningPreferences} from "../../../../types/user details/learning-preferences.enum";
import {MeetingPreferences} from "../../../../types/user details/mentor/mentor.enum";
import {NeurodivergenceConditions} from "../../../../types/user details/neurodivergence.enum";
import {Mentee} from "../../../../types/user details/mentee.interface";
import {TextAreaInputComponent} from "../../../../shared/component/textarea-input/text-area-input.component";
import {TextInputComponent} from "../../../../shared/component/text-input/text-input.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-edit-mentee',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TextAreaInputComponent,
    TextInputComponent
  ],
  templateUrl: './edit-mentee.component.html',
  styleUrl: './edit-mentee.component.scss'
})

export class EditMenteeComponent {
  private readonly _router = inject(Router);
  private readonly _formBuilder = inject(FormBuilder);

  learningPreferenceOptions = Object.values(LearningPreferences);
  meetingPreferenceOptions = Object.values(MeetingPreferences);
  neurodivergentConditionOptions = Object.values(NeurodivergenceConditions);

  mentee: Mentee = {
    description: "Hi, I am vorname. I have been caring for my Autistic son for 13 years now. \n" +
      "I have experience helping him self-regulate and vibe.",
    goals: ["Win, win, win win", "become a better person"],
    learningPreference: [LearningPreferences.KINESTHETIC, LearningPreferences.READING],
    expectations: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    meetingPreference: [MeetingPreferences.VIDEO_CALLS, MeetingPreferences.ONLINE_MESSAGING],
    neurodivergentConditions: [NeurodivergenceConditions.ADHD, NeurodivergenceConditions.AUTISM],
    commitment: "I would like a programme for 6 weeks meeting twice a week"

  }

  goals = this._formBuilder.array(
    this.mentee.goals.map(goal => this._formBuilder.control(goal, Validators.required)),
    Validators.required
  )

  learningPreferences = this._formBuilder.array(
    this.learningPreferenceOptions.map(preference => {
      const defaultValue = this.mentee.learningPreference.includes(preference);
      return this._formBuilder.control(defaultValue, Validators.required)
    })
    ,
    Validators.required
  )

  meetingPreferences = this._formBuilder.array(
    this.meetingPreferenceOptions.map(preference => {
      const defaultValue = this.mentee.meetingPreference.includes(preference);
      return this._formBuilder.control(defaultValue, Validators.required)
    })
    ,
    Validators.required
  )

  neurodivergentConditions = this._formBuilder.array(
    this.neurodivergentConditionOptions.map(condition => {
      const defaultValue = this.mentee.neurodivergentConditions.includes(condition);
      return this._formBuilder.control(defaultValue, Validators.required)
    })
    ,
    Validators.required
  )

  menteeDetails: FormGroup = this._formBuilder.group({
    description: [this.mentee.description, Validators.required],
    goals: this.goals,
    learningPreferences: this.learningPreferences,
    expectations: [this.mentee.expectations],
    neurodivergentConditions: this.neurodivergentConditions,
    meetingPreferences: this.meetingPreferences,
    commitment: [this.mentee.commitment, Validators.required],
  });

  cancelEdit() {
    this._router.navigate(['/profile/mentee-details']);
  }

}
