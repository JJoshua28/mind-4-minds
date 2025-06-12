import {Component, EventEmitter, input, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {User} from "../../../types/user.interface";
import {Mentor} from "../../../types/user details/mentor/mentor.interface";
import { experienceDuration } from '../../helpers/experienceDurations';

@Component({
  selector: 'app-user-card',
  standalone: true,
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})

export class UserCardComponent implements OnInit{
  @Output() cardContainerClicked = new EventEmitter<void>();
  @Output() isHovering = new EventEmitter<boolean>();

  public readonly $user = input.required<User>();
  $mentorDetails!: WritableSignal<Mentor>;
  $isHovering: WritableSignal<boolean>= signal(false);

  ngOnInit(): void {
    this.$mentorDetails = signal(this.$user().mentorDetails as Mentor);

  }

  protected readonly experienceDuration = experienceDuration;

}
