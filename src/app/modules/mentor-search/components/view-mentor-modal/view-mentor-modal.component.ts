import {Component, ElementRef, input, signal, ViewChild, WritableSignal} from '@angular/core';
import {NgClass} from "@angular/common";
import {User} from "../../../../types/user.interface";

import {MenteeDetailsComponent} from "../../../../shared/component/mentee-details/mentee-details.component";
import {MentorDetailsComponent} from "../../../../shared/component/mentor-details/mentor-details.component";
import { experienceDuration } from '../../../../shared/helpers/experienceDurations';

@Component({
  selector: 'app-view-mentor-modal',
  standalone: true,
  imports: [
    NgClass,
    MenteeDetailsComponent,
    MentorDetailsComponent
  ],
  templateUrl: './view-mentor-modal.component.html',
  styleUrl: './view-mentor-modal.component.scss'
})
export class ViewMentorModalComponent {
  @ViewChild('modal') modal!: ElementRef<HTMLDialogElement>;

  isHidden: WritableSignal<boolean>= signal(true);

  $user = input.required<User>()

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
