import {Component, input} from '@angular/core';
import {NgClass} from "@angular/common";
import {Mentor} from "../../types/mentor.interface";

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})

export class UserCardComponent {
  public readonly mentor  = input.required<Mentor>();

}
