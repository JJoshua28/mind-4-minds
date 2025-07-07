import {inject, Injectable } from "@angular/core";
import {map, Observable, take} from "rxjs";

import {HttpService} from "../services/http.service";

import {mapMentorDetails, mapMentorUser,} from "../mapper/api/apiToMentorDetails.mapper";
import {MentorDetailsApi, MentorUserApi} from "../../types/api/mentor-details.interface";
import {MentorDetails} from "../../types/user details/mentor/mentor.interface";
import {MenteeInfo, MentorInfo} from "../../types/user details/user-info.interface";
import {MenteeUser, MentorUser} from "../../types/user.interface";
import {mapMentorDetailsToApiPayload} from "../mapper/mentorDetailsToApi.mapper";
import {mapMentorUserApiToUser} from "../mapper/api/apiToMentorUser.mapper";
import {MenteeDetailsApi} from "../../types/api/mentee-details-interface";
import {mapMenteeUser} from "../mapper/api/apiToMenteeDetails.mapper";

@Injectable({
  providedIn: 'root'
})
export class MentorRepository {


  private readonly apiService = inject(HttpService)

  mentorDetails(userDetailsId: string): Observable<MentorDetails> {
    const mentorEndpoint = `users/mentor-details/?user_id=${userDetailsId}`;
    return this.apiService.get<MentorDetailsApi[]>(mentorEndpoint).pipe(
      map(([mentorDetails]) => {
        return mapMentorDetails(mentorDetails)
      })
    );
  }

  mentorInfo (userDetailsId: string): Observable<MentorInfo> {
    return this.mentorDetails(userDetailsId).pipe(
      map((mentorDetails) => {
        return {
          description: mentorDetails.description,
          experience: mentorDetails.experience,
          qualifications: mentorDetails.qualifications,
          commitment: mentorDetails.commitment,
          meetingPreferences: mentorDetails.meetingPreferences,
          neurodivergentConditions: mentorDetails.neurodivergentConditions,

        }
      })
    )
  }

  mentorUser(userDetailsId: string): Observable<MentorUser> {
    const mentorEndpoint = `users/mentor-details/?user_id=${userDetailsId}`;
    return this.apiService.get<MentorUserApi[]>(mentorEndpoint).pipe(
      map(([mentorDetails]) => {
        return mentorDetails? mapMentorUser(mentorDetails) : {} as MentorUser
      })
    );
  }

  getMentorsMentees(mentorId: string): Observable<MenteeUser[]> {
    const menteeEndpoint = `users/mentor-details/${mentorId}/mentees`;
    return this.apiService.get<MenteeDetailsApi[]>(menteeEndpoint).pipe(
      take(1),
      map((mentors) => mentors.map((mentor) => mapMenteeUser(mentor)))
    );
  }

  getActiveMentors(userDetailsId: string): Observable<MentorUser[]> {
    const mentorEndpoint = `users/mentor-details/?is_available=true&user_id_not=${userDetailsId}`;

    return this.apiService.get<MentorUserApi[]>(mentorEndpoint).pipe(
      take(1),
      map((response) => {
        return response.length > 0 ?
          response.map(mentor => {
            return mapMentorUserApiToUser(mentor);
          }) : [];
      }),
      map((mentors) => mentors.filter(mentor => mentor.id !== userDetailsId))
    )
  }

  updateMentorDetails(mentorDetails: MentorDetails): Observable<MentorDetails> {
    const mentorEndpoint = "users/mentor-details/";
    const { id, ...payload } = mentorDetails;

    if (!id) {
      throw new Error('Cannot update mentor details: no ID provided.');
    }

    const updateEndpoint = `${mentorEndpoint}${id}/`;

    return this.apiService.put(updateEndpoint, mapMentorDetailsToApiPayload(payload)).pipe(
      map((response) => mapMentorDetails(response as MentorDetailsApi)),
      take(1)
    );
  }

  createMentor (mentorDetails: MentorDetailsApi) {
    const mentorDetailsEndpoint = 'users/mentor-details/';

    return this.apiService.post<MentorDetailsApi>(mentorDetailsEndpoint, mentorDetails).pipe(
      map((details) => mapMentorDetails(details))
    );
  }

  deleteMentorDetails(detailsId: string) {
    const mentorEndpoint = `users/mentor-details/${detailsId}`;

    return this.apiService.delete(mentorEndpoint).pipe(
      take(1),
      map(() => "")
    )
  }
}
