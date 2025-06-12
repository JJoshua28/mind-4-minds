import {Component, EventEmitter, input, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {User} from "../../../types/user.interface";
import {Mentor} from "../../../types/user details/mentor/mentor.interface";
import {experienceDuration} from '../../helpers/experienceDurations';
import {UserType} from "../../../types/user-type.enum";
import {Mentee} from "../../../types/user details/mentee.interface";

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
  $userType = input.required<UserType>();

  $roleDetails!: WritableSignal<Mentor | Mentee>;
  $isHovering: WritableSignal<boolean>= signal(false);

  ngOnInit(): void {
    this.$roleDetails = this.$userType() === UserType.MENTOR?
      signal(this.$user().mentorDetails as Mentor) : signal(this.$user().menteeDetails as Mentee);


  }

  protected readonly experienceDuration = experienceDuration;

  protected readonly userType = UserType;
}
