import {inject, Injectable} from '@angular/core';
import {HttpService} from "../services/http.service";
import {MenteeMentorLinkApi} from "../../types/api/mentee-mentor-link.interface";
import {map} from "rxjs";
import {mapMentorUser} from "../mapper/api/apiToMentorDetails.mapper";
import {mapMenteeUser} from "../mapper/api/apiToMenteeDetails.mapper";

@Injectable({
  providedIn: 'root'
})
export class MenteeMentorLinkRepositoryService {
  private readonly httpService = inject(HttpService)

  createMenteeMentorLink(mentorId: string, menteeId: string) {
    const endpoint = "users/mentees-and-mentors/";
    return this.httpService.post<MenteeMentorLinkApi>(endpoint, {
      mentees: menteeId,
      mentors: mentorId
    })
  }

  getMenteesMentors(menteeId: string) {
    const endpoint = `users/mentees-and-mentors/?menteeId=${menteeId}`;
    return this.httpService.get<MenteeMentorLinkApi[]>(endpoint).pipe(
      map((menteeMentorLinks: MenteeMentorLinkApi[]) => {
        return menteeMentorLinks.map((menteeMentorLink) => {
          return mapMentorUser(menteeMentorLink.mentor_record)
        })
      })
    );
  }

  getMenteesMentorsByUserId(userId: string) {
    const endpoint = `users/mentees-and-mentors/?menteeByUserId=${userId}`;
    return this.httpService.get<MenteeMentorLinkApi[]>(endpoint).pipe(
      map((menteeMentorLinks: MenteeMentorLinkApi[]) => {
        return menteeMentorLinks.map((menteeMentorLink) => {
          return mapMentorUser(menteeMentorLink.mentor_record)
        })
      })
    );
  }

  getMentorsMenteesByUserId(userId: string) {
    const endpoint = `users/mentees-and-mentors/?mentorByUserId=${userId}`;
    return this.httpService.get<MenteeMentorLinkApi[]>(endpoint).pipe(
      map((menteeMentorLinks: MenteeMentorLinkApi[]) => {
        return menteeMentorLinks.map((menteeMentorLink) => {
          return mapMenteeUser(menteeMentorLink.mentee_record)
        })
      })
    );

  }

  deleteMentorsMenteeLink(mentorUserDetailsId: string, menteeUserDetailsId: string) {
    const endpoint = `users/mentees-and-mentors/delete-link/`;

    return this.httpService.post<{
      deleted: string
    }>(endpoint, {
      menteeUserDetailsId,
      mentorUserDetailsId
    })



  }

}
