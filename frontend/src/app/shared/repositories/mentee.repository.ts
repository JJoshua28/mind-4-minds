import {inject, Injectable } from "@angular/core";
import {map, Observable, of, take} from "rxjs";

import {MenteeDetails} from "../../types/user details/mentee.interface";
import {MenteeDetailsApi} from "../../types/api/mentee-details-interface";
import {MenteeInfo} from "../../types/user details/user-info.interface";
import {MenteeUser, MentorUser, UserDetails} from "../../types/user.interface";

import {HttpService} from "../services/http.service";

import {mapMenteeDetails, mapMenteeUser} from "../mapper/api/apiToMenteeDetails.mapper";
import mapMenteeDetailsToApiPayload from "../mapper/menteeDetailsToApi.mapper";
import {mapMentorUser} from "../mapper/api/apiToMentorDetails.mapper";
import {MentorDetailsApi, MentorUserApi} from "../../types/api/mentor-details.interface";

@Injectable({
  providedIn: 'root'
})
export class MenteeRepository {


  private readonly apiService = inject(HttpService)

  menteeDetails(userDetailsId: string): Observable<MenteeDetails> {
    const menteeEndpoint = `users/mentee-details/?user_id=${userDetailsId}`;
    return this.apiService.get<MenteeDetailsApi[]>(`${menteeEndpoint}`).pipe(
      map(([menteeDetails]) => {
        return mapMenteeDetails(menteeDetails)
      })
    );
  }

  menteeInfo (userDetailsId: string): Observable<MenteeInfo> {
    return this.menteeDetails(userDetailsId).pipe(
      map((menteeDetails) => {
        return {
          description: menteeDetails.description,
          expectations: menteeDetails.expectations,
          goals: menteeDetails.goals,
          commitment: menteeDetails.commitment,
          meetingPreferences: menteeDetails.meetingPreferences,
          neurodivergentConditions: menteeDetails.neurodivergentConditions,
          learningPreferences: menteeDetails.learningPreferences,
        }
      })
    )
  }

  menteeUser(userDetailsId: string): Observable<MenteeUser> {
    const menteeEndpoint = `users/mentee-details/?user_id=${userDetailsId}`;
      return this.apiService.get<MenteeDetailsApi[]>(menteeEndpoint).pipe(
        map(([menteeDetails]) => {
          return menteeDetails? mapMenteeUser(menteeDetails) : {} as MenteeUser
        })
      );
  }

  getMenteeMentors(menteeId: string): Observable<MentorUser[]> {
    const menteeEndpoint = `users/mentee-details/${menteeId}/mentors`;
    return this.apiService.get<MentorUserApi[]>(menteeEndpoint).pipe(
      take(1),
      map((mentors) => mentors.map((mentor) => mapMentorUser(mentor)))
    );
  }

  updateMenteeDetails(menteeDetails: MenteeDetails): Observable<MenteeDetails> {
    const menteeEndpoint = "users/mentee-details/";
    const { id, ...payload } = menteeDetails;

    if (!id) {
      throw new Error('Cannot update mentee details: no ID provided.');
    }

    const updateEndpoint = `${menteeEndpoint}${id}/`;

    return this.apiService.put(updateEndpoint, mapMenteeDetailsToApiPayload(payload)).pipe(
      map((response) => mapMenteeDetails(response as MenteeDetailsApi)),
      take(1)
    );
  }

  createMentee (menteeDetails: MenteeDetailsApi) {
    const menteeDetailsEndpoint = 'users/mentee-details/';

    return this.apiService.post<MenteeDetailsApi>(menteeDetailsEndpoint, menteeDetails).pipe(
      map((details) => mapMenteeDetails(details))
    );


  }

  deleteMenteeDetails(detailsId: string) {
    const menteeEndpoint = `users/mentee-details/${detailsId}`;

    return this.apiService.delete(menteeEndpoint).pipe(
      take(1),
      map(() => "")
    )
  }



}
