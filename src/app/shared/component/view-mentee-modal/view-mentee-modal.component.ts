import {Component, computed, ElementRef, input, Signal, signal, ViewChild, WritableSignal} from '@angular/core';
import {NgClass} from "@angular/common";

import {MenteeInfo, UserInfo} from "../../../types/user details/user-info.interface";

import {MenteeDetailsComponent} from "../mentee-details/mentee-details.component";
import {MentorDetailsComponent} from "../mentor-details/mentor-details.component";
import { experienceDuration } from '../../helpers/experienceDurations';

@Component({
  selector: 'app-view-mentee-modal',
  standalone: true,
  imports: [
    NgClass,
    MenteeDetailsComponent,
    MentorDetailsComponent
  ],
  templateUrl: './view-mentee-modal.component.html',
  styleUrl: './view-mentee-modal.component.scss'
})

export class ViewMenteeModalComponent {
  @ViewChild('modal') modal!: ElementRef<HTMLDialogElement>;

  isHidden: WritableSignal<boolean>= signal(true);
  $canConnectToMentor = input<boolean>(false)

  $userInfo = input.required<UserInfo>()
  $menteeInfo = input.required<MenteeInfo>()

  $occupationStartDate: Signal<Date> = computed(() => {
    return new Date(this.$userInfo()?.occupationStartDate as string);
  })

  protected readonly experienceDuration = experienceDuration;

  show () {
    this.isHidden.set(!this.isHidden());
    this.modal.nativeElement.showModal()
  }

  close () {
    this.isHidden.set(!this.isHidden());

    this.modal.nativeElement.close();
  }

}
