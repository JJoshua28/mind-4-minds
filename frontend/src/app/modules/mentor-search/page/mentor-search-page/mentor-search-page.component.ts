import {Component, computed, inject, OnInit, Signal, signal, ViewChild, WritableSignal} from '@angular/core';

import {UserCardComponent} from "../../../../shared/component/user-card/user-card.component";
import {ViewMentorModalComponent} from "../../../../shared/component/view-mentor-modal/view-mentor-modal.component";
import {MentorUser} from "../../../../types/user.interface";

import {NgClass} from "@angular/common";
import {ActionType} from "../../../../types/action-type.enum";
import {UserType} from "../../../../types/user-type.enum";
import {MentorInfo} from "../../../../types/user details/user-info.interface";
import {UserService} from "../../../../shared/services/user/user-service.service";
import {MentorRepository} from "../../../../shared/repositories/mentor.repository.service";
import {RequestsRepositoryService} from "../../../../shared/repositories/requests.repository.service";


@Component({
  selector: 'app-mentor-search-page',
  standalone: true,
  imports: [
    UserCardComponent,
    ViewMentorModalComponent,
    NgClass
  ],
  templateUrl: './mentor-search-page.component.html',
  styleUrl: './mentor-search-page.component.scss'
})
export class MentorSearchPageComponent implements OnInit {
  @ViewChild(ViewMentorModalComponent) modal!: ViewMentorModalComponent;

private readonly _requestsRepository = inject(RequestsRepositoryService);
  private readonly _mentorRepository = inject(MentorRepository);
  private readonly _userService = inject(UserService);

  $mentors: WritableSignal<MentorUser[]> = signal([]);

  hasSelectedUser: boolean = false;

  $selectedUser: WritableSignal<MentorUser> = signal({} as MentorUser);

  $mentorInfo: Signal<MentorInfo>  = computed(() => {
    const {id, isAvailable, ...mentorInfo} = this.$selectedUser().mentorDetails;
    return mentorInfo;
  })

  ngOnInit() {
    this._mentorRepository.getActiveMentors(this._userService.$userDetails().id).subscribe(
      {
        next: result => {
          this.$mentors.set(result);
        },
        error: error => {
          this.$mentors.set([]);
        }
      }
    )
  }

  onCardClick(user: MentorUser) {
    this.$selectedUser.set(user);
    this.hasSelectedUser = true;

    setTimeout(() => {
      this.modal?.show();
    }, 200);
  }

  sendMentorRequest(mentor: MentorUser) {
    const mentorRequestData = {
      sender: this._userService.$userDetails().id,
      recipients: [mentor.id],
      body: "I would like to connect with you as a mentee. Please see my details below and get in touch.",
      subject: "Mentorship Request",
      action_type: ActionType.ADD_MENTOR,
    }

    this._requestsRepository.createRequest(mentorRequestData).subscribe({

    })


  }


  mentorUserMapInfo(user: MentorUser) {
    const { mentorDetails, menteeDetails, isArchived, roles, joined, id, email, ...userInfo } = user;

    return {
      ...userInfo,
      description: mentorDetails.description,
      neurodivergentConditions: mentorDetails.neurodivergentConditions,
    };
  }

  protected readonly UserType = UserType;
}
