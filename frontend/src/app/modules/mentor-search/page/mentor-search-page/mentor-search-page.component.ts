import {Component, computed, inject, OnInit, Signal, signal, ViewChild, WritableSignal} from '@angular/core';

import {UserCardComponent} from "../../../../shared/component/user-card/user-card.component";
import {ViewMentorModalComponent} from "../../../../shared/component/view-mentor-modal/view-mentor-modal.component";
import {NeurodivergenceConditions} from "../../../../types/user details/neurodivergence.enum";
import {MentorUser} from "../../../../types/user.interface";
import {MeetingPreferences} from "../../../../types/user details/mentor/mentor.enum";
import {NgClass} from "@angular/common";
import {UserType} from "../../../../types/user-type.enum";
import {MentorInfo} from "../../../../types/user details/user-info.interface";
import {UserService} from "../../../../shared/services/user/user-service.service";
import {MentorService} from "../../../../shared/services/user/mentor.service";

@Component({
  selector: 'app-mentor-search-page',
  standalone: true,
  imports: [
    UserCardComponent,
    ViewMentorModalComponent,
    NgClass
  ],
  providers: [
    UserService,
    MentorService,
  ],
  templateUrl: './mentor-search-page.component.html',
  styleUrl: './mentor-search-page.component.scss'
})
export class MentorSearchPageComponent implements OnInit {
  @ViewChild(ViewMentorModalComponent) modal!: ViewMentorModalComponent;

  private readonly mentorService = inject(MentorService);

  $mentors: WritableSignal<MentorUser[]> = signal([]);

  hasSelectedUser: boolean = false;

  $selectedUser: WritableSignal<MentorUser> = signal({} as MentorUser);

  $mentorInfo: Signal<MentorInfo>  = computed(() => {
    const {id, isAvailable, ...mentorInfo} = this.$selectedUser().mentorDetails;
    return mentorInfo;
  })

  ngOnInit() {
    this.mentorService.getActiveMentors().subscribe(
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
