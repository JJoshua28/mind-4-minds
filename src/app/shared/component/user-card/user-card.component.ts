import {Component, EventEmitter, input, OnInit, Output, signal, WritableSignal} from '@angular/core';


import {experienceDuration} from '../../helpers/experienceDurations';
import { UserType } from "../../../types/user-type.enum";
import {UserInfo} from "../../../types/user details/user-info.interface";

export interface CardInfo extends UserInfo {
  description: string;
  neurodivergentConditions: string[];
}

@Component({
  selector: 'app-user-card',
  standalone: true,
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})

export class UserCardComponent implements OnInit{
  @Output() cardContainerClicked = new EventEmitter<void>();
  @Output() isHovering = new EventEmitter<boolean>();

  public readonly $userCardInfo = input.required<CardInfo>();
  $userType = input.required<UserType>();

  occupationStartDate!: Date;

  $isHovering: WritableSignal<boolean>= signal(false);


  protected readonly experienceDuration = experienceDuration;

  protected readonly userType = UserType;

  ngOnInit() {
    if(this.$userCardInfo().occupationStartDate) this.occupationStartDate = new Date(this.$userCardInfo().occupationStartDate as string)
  }
}
