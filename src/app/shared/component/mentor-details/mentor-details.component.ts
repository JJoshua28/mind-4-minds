import {Component, input} from '@angular/core';

import {Mentor} from "../../../types/user details/mentor/mentor.interface";


@Component({
  selector: 'app-mentor-details',
  standalone: true,
  imports: [],
  templateUrl: './mentor-details.component.html',
  styleUrl: './mentor-details.component.scss'
})
export class MentorDetailsComponent {
  $mentorDetails = input.required<Mentor>()
}
