import {Component, input} from '@angular/core';
import {Mentee} from "../../../types/user details/mentee.interface";

@Component({
  selector: 'app-mentee-details',
  standalone: true,
  imports: [],
  templateUrl: './mentee-details.component.html',
  styleUrl: './mentee-details.component.scss'
})
export class MenteeDetailsComponent {
  $mentee = input.required<Mentee>();
}
