import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';

import {UserType} from "../../../../types/user-type.enum";

import {ListMenteesComponent} from "../../components/list-users/list-mentees.component";


import {UserService} from "../../../../shared/services/user/user-service.service";
import {MenteeMentorLinkRepositoryService} from "../../../../shared/repositories/mentee-mentor-link.repository.service";
import {MenteeUser} from "../../../../types/user.interface";
import {switchMap, take} from "rxjs";


@Component({
  selector: 'app-my-mentees-page',
  standalone: true,
  imports: [
    ListMenteesComponent,
  ],
  templateUrl: './my-mentees-page.component.html',
  styleUrl: './my-mentees-page.component.scss'
})
export class MyMenteesPageComponent implements  OnInit {
  private readonly _menteeMentorLinkRepository = inject(MenteeMentorLinkRepositoryService)

  private readonly _userService = inject(UserService)

  protected readonly noMentorsMessage = "No mentees to help yet. Sit tight, or review your profile"
  protected readonly heading = "My mentees"
  protected isHoveringOnUserCard = false
  protected userType = UserType.MENTEE

  $mentees: WritableSignal<Array<MenteeUser>> = signal([])

  ngOnInit(): void {
    this._menteeMentorLinkRepository.getMentorsMenteesByUserId(this._userService.$userDetails().id).pipe(
      take(1)
    ).subscribe(mentees => {
      this.$mentees.set(mentees)
    })
  }

  endMentorship(menteeUserDetailsId: string) {
    this._menteeMentorLinkRepository.deleteMentorsMenteeLink(this._userService.$userDetails().id, menteeUserDetailsId).pipe(
      take(1),
      switchMap(() => {
        return this._menteeMentorLinkRepository.getMentorsMenteesByUserId(this._userService.$userDetails().id)
      }),
      take(1)
    ).subscribe(mentees => {
      this.$mentees.set(mentees)
    })
  }
}
