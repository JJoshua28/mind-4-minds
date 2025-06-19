import {Component, input} from '@angular/core';
import {MenteeInfo} from "../../../types/user details/user-info.interface";

@Component({
  selector: 'app-mentee-details',
  standalone: true,
  imports: [],
  templateUrl: './mentee-details.component.html',
  styleUrl: './mentee-details.component.scss'
})
export class MenteeDetailsComponent {
  $mentee = input.required<MenteeInfo>();
}
