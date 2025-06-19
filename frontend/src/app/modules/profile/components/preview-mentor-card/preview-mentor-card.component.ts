import {Component, computed, ElementRef, input, signal, ViewChild, WritableSignal} from '@angular/core';
import {NgClass} from "@angular/common";

import {UserType} from "../../../../types/user-type.enum";
import { MentorInfo, UserInfo} from "../../../../types/user details/user-info.interface";

import {MentorDetailsComponent} from "../../../../shared/component/mentor-details/mentor-details.component";
import {UserCardComponent} from "../../../../shared/component/user-card/user-card.component";


@Component({
  selector: 'app-preview-mentor-card',
  standalone: true,
  imports: [
    MentorDetailsComponent,
    UserCardComponent,
    NgClass
  ],
  templateUrl: './preview-mentor-card.component.html',
  styleUrl: './preview-mentor-card.component.scss'
})
export class PreviewMentorCardComponent {
  @ViewChild('modal') modal!: ElementRef<HTMLDialogElement>;

  isHidden: WritableSignal<boolean>= signal(true);

  $user = input.required<MentorInfo & UserInfo>()

  $cardInfo = computed(() => {
    const {
      firstName,
      lastName,
      email,
      profilePic,
      occupation,
      occupationStartDate,

    } = this.$user();

    return {
      firstName,
      lastName,
      email,
      profilePic,
      occupation,
      occupationStartDate,
      description: this.$user().description,
      neurodivergentConditions: this.$user().neurodivergentConditions
    }

  })

  show () {
    this.isHidden.set(!this.isHidden());
    this.modal.nativeElement.showModal()
  }

  close () {
    this.isHidden.set(!this.isHidden());

    this.modal.nativeElement.close();
  }

  protected readonly UserType = UserType;
}
