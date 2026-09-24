import {Component, computed, ElementRef, input, signal, ViewChild, WritableSignal} from '@angular/core';
import {NgClass} from "@angular/common";

import {UserType} from "../../../../types/user-type.enum";
import { MentorInfo, UserInfo} from "../../../../types/user details/user-info.interface"

import {UserCardComponent} from "../../../../shared/component/user-card/user-card.component";


@Component({
  selector: 'app-preview-mentor-card',
  standalone: true,
  imports: [
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
      id,
      firstName,
      lastName,
      email,
      profilePic,
      occupation,
      joined,
      roles,
      isAdmin,
      isArchived,
      occupationStartDate,

    } = this.$user();

    return {
      id,
      firstName,
      lastName,
      email,
      profilePic,
      occupation,
      occupationStartDate,
      joined,
      roles,
      isAdmin,
      isArchived,
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
