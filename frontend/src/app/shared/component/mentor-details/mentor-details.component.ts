import {Component, input} from '@angular/core';

import {MentorInfo} from "../../../types/user details/user-info.interface";


@Component({
  selector: 'app-mentor-details',
  standalone: true,
  imports: [],
  templateUrl: './mentor-details.component.html',
  styleUrl: './mentor-details.component.scss'
})
export class MentorDetailsComponent {
  $mentorDetails = input.required<MentorInfo>()
}
