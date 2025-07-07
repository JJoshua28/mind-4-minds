import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {ListMentorsComponent} from "../../components/list-users/list-mentors.component";
import {MentorUser} from "../../../../types/user.interface";

import {UserType} from "../../../../types/user-type.enum";

import {MenteeMentorLinkRepositoryService} from "../../../../shared/repositories/mentee-mentor-link.repository.service";
import {UserService} from "../../../../shared/services/user/user-service.service";
import {switchMap, take} from "rxjs";

@Component({
  selector: 'app-my-mentors-page',
  standalone: true,
  imports: [
    ListMentorsComponent,
  ],
  providers: [
  ],
  templateUrl: './my-mentors-page.component.html',
  styleUrl: './my-mentors-page.component.scss'
})
export class MyMentorsPageComponent implements OnInit {
  private readonly _menteeMentorLinkRepository = inject(MenteeMentorLinkRepositoryService)
  private readonly _userService = inject(UserService)

  protected readonly noMentorsMessage = "Reflect on what you want from a mentorship and find a mentor"
  protected readonly heading = "My mentors"
  protected isHoveringOnUserCard = false
  protected userType = UserType.MENTOR


  $mentors: WritableSignal<MentorUser[]> = signal([])

  ngOnInit(): void {
    this._menteeMentorLinkRepository.getMenteesMentorsByUserId(this._userService.$userDetails().id).subscribe(mentors => {
      this.$mentors.set(mentors)
    })
  }

  endMentorship(mentorUserDetailsId: string) {
    this._menteeMentorLinkRepository.deleteMentorsMenteeLink(mentorUserDetailsId, this._userService.$userDetails().id).pipe(
      take(1),
      switchMap(() => {
        return this._menteeMentorLinkRepository.getMenteesMentors(this._userService.$userDetails().id)
      }),
      take(1)
    ).subscribe(mentees => {
      this.$mentors.set(mentees)
    })
  }

}
