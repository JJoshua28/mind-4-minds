import {inject, Injectable, OnInit, Signal} from '@angular/core';
import {Router} from "@angular/router";
import {map, Observable, of, switchMap, take, tap} from "rxjs";

import {LocalStorageService} from "../local-storage.service";
import {AuthServiceService} from "../auth-service.service";
import {HttpService} from "../http.service";
import {UserService} from "./user-service.service";

import {MentorDetails} from "../../../types/user details/mentor/mentor.interface";
import {MentorDetailsApi} from "../../../types/api/mentor-details.interface";
import {mapMentorDetails} from "../../mapper/api/apiToMentorDetails.mapper";
import {UserType} from "../../../types/user-type.enum";
import {MentorUser, UserDetails} from "../../../types/user.interface";
import {toSignal} from "@angular/core/rxjs-interop";
import {mapMentorDetailsToApiPayload} from "../../mapper/mentorDetailsToApi.mapper";
import {MentorInfo} from "../../../types/user details/user-info.interface";

@Injectable({
  providedIn: null
})
export class MentorService implements OnInit {
  private readonly _router = inject(Router)

  private readonly _localStorageService = inject(LocalStorageService)
  private readonly _authService = inject(AuthServiceService)
  private readonly _userService = inject(UserService)

  private readonly apiService = inject(HttpService)

  ngOnInit(): void {
    const authToken = this._authService.getAccessToken();
    const userId = this._localStorageService.getItem("user_id") ;


    if (!authToken || !userId && this._router.url !== '/login') {
      this.throwUserUnauthorizedUser();
    }
  }

  throwUserUnauthorizedUser() {
    this._router.navigate(['/profile']);
  }

  mentorDetails(): Observable<MentorDetails> {
    const mentorEndpoint = "users/mentor-details/?user_id=";

    return this._userService.userDetails().pipe(
      tap((userDetails) => {
        if(!userDetails.roles.includes(UserType.MENTOR)) {
          this.throwUserUnauthorizedUser()
        }
      }),
      switchMap((userDetails) => {
        const {id} = userDetails;

        return this.apiService.get(`${mentorEndpoint}${id}`).pipe(
          map((mentorDetails) => {
            return mentorDetails;
          })
        );
      }),
      take(1),
      map((mentorDetails) => {
        const [details] = mentorDetails as MentorDetailsApi[];
        return mapMentorDetails(details)
      }),
    )
  }

  mentorInfo (): Observable<MentorInfo> {
    return this.mentorDetails().pipe(
      map((mentorDetails) => {
        return {
          description: mentorDetails.description,
          qualifications: mentorDetails.qualifications,
          experience: mentorDetails.experience,
          commitment: mentorDetails.commitment,
          meetingPreferences: mentorDetails.meetingPreferences,
          neurodivergentConditions: mentorDetails.neurodivergentConditions
        }
      })
    )
  }

  mentorUser(): Observable<MentorUser> {
    const mentorEndpoint = "users/mentor-details/?user_id=";

    let userDetails: UserDetails;

    return this._userService.userDetails().pipe(
      tap((details) => {
        if(!details.roles.includes(UserType.MENTOR)) {
          this.throwUserUnauthorizedUser()
        }
        userDetails = details;
      }),
      switchMap((details) => {
        const {id} = details;

        return this.apiService.get(`${mentorEndpoint}${id}`).pipe(
          map((mentorDetails) => {
            return mentorDetails;
          })
        );
      }),
      take(1),
      map((mentorDetails) => {
        const [details] = mentorDetails as MentorDetailsApi[];
        return {
          ...userDetails,
          mentorDetails: {...mapMentorDetails(details)}
        };
      })
    )
  }

  updateMentorDetails(mentorDetails: Partial<MentorDetails>): Observable<MentorDetails> {
    const mentorEndpoint = "users/mentor-details/";

    const {id: ID, ...payload} = mentorDetails;

    return this.mentorDetails().pipe(
      switchMap((details) => {
        const {id: mentorId, ...data} = details;
        const updateMentorEndpoint = `${mentorEndpoint}${ID || mentorId}/`;

        return this.apiService.put(updateMentorEndpoint, mapMentorDetailsToApiPayload({...data, ...payload}))
      }),
      take(1),
      map((mentorDetails) => mapMentorDetails(mentorDetails as MentorDetailsApi))
    )


  }


}
