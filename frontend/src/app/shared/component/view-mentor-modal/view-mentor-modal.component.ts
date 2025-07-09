import {Component, computed, ElementRef, input, Signal, signal, ViewChild, WritableSignal} from '@angular/core';
import {NgClass} from "@angular/common";

import { MentorInfo, UserInfo } from "../../../types/user details/user-info.interface";

import {MenteeDetailsComponent} from "../mentee-details/mentee-details.component";
import {MentorDetailsComponent} from "../mentor-details/mentor-details.component";
import { experienceDuration } from '../../helpers/experienceDurations';
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-view-mentor-modal',
  standalone: true,
  imports: [
    NgClass,
    MentorDetailsComponent
  ],
  templateUrl: './view-mentor-modal.component.html',
  styleUrl: './view-mentor-modal.component.scss'
})

export class ViewMentorModalComponent {
  @ViewChild('modal') modal!: ElementRef<HTMLDialogElement>;

  $canConnectToMentor = input<boolean>(false)

  $_userInfo = input.required<UserInfo>()
  $mentorInfo = input.required<MentorInfo>()

  protected readonly $userInfo = computed(() => ({
    ...this.$_userInfo(),
    profilePic: this.$_userInfo().profilePic  ? this.$_userInfo().profilePic : environment.defaultProfilePic
  }));

  $occupationStartDate: Signal<Date> = computed(() => {
    return new Date(this.$_userInfo()?.occupationStartDate as string);
  })

  protected readonly experienceDuration = experienceDuration;

  show () {
    this.modal.nativeElement.showModal()
  }

  close () {

    this.modal.nativeElement.close();
  }

}
