import {Component, computed, EventEmitter, input, OnInit, Output, signal, WritableSignal} from '@angular/core';


import {experienceDuration} from '../../helpers/experienceDurations';
import { UserType } from "../../../types/user-type.enum";
import {UserInfo} from "../../../types/user details/user-info.interface";
import {environment} from "../../../../environments/environment";

export interface CardInfo extends Omit<UserInfo, 'email'> {
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

  public readonly $_userCardInfo = input.required<CardInfo>();

  protected readonly $userCardInfo = computed(() => ({
    ...this.$_userCardInfo(),
    profilePic: this.$_userCardInfo().profilePic  ? this.$_userCardInfo().profilePic : environment.defaultProfilePic
  }));

  $userType = input.required<UserType>();

  occupationStartDate!: Date;

  $isHovering: WritableSignal<boolean>= signal(false);


  protected readonly experienceDuration = experienceDuration;

  protected readonly userType = UserType;

  ngOnInit() {
    if(this.$userCardInfo().occupationStartDate) this.occupationStartDate = new Date(this.$_userCardInfo().occupationStartDate as string)
  }
}
