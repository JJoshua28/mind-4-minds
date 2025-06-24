import {Component, input} from '@angular/core';
import {MentorDetailsFormControl} from "../../../types/user details/mentor/mentor-details-form.interface";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TextAreaInputComponent} from "../textarea-input/text-area-input.component";
import {TitleCasePipe} from "@angular/common";
import {MeetingPreferences} from "../../../types/user details/mentor/mentor.enum";
import {NeurodivergenceConditions} from "../../../types/user details/neurodivergence.enum";
import {TextInputComponent} from "../text-input/text-input.component";

@Component({
  selector: 'app-edit-mentor-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TextAreaInputComponent,
    TextInputComponent
  ],
  templateUrl: './edit-mentor-details.component.html',
  styleUrl: './edit-mentor-details.component.scss'
})
export class EditMentorDetailsComponent {
  meetingPreferenceOptions = Object.values(MeetingPreferences);
  neurodivergentConditionOptions = Object.values(NeurodivergenceConditions);

  $mentorDetailsForm = input.required<FormGroup<MentorDetailsFormControl>>()

}
