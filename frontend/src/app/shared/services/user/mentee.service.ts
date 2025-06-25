import {inject, Injectable, OnInit, Signal} from '@angular/core';
import {Router} from "@angular/router";
import {map, Observable, of, switchMap, take, tap} from "rxjs";

import {LocalStorageService} from "../local-storage.service";
import {AuthServiceService} from "../auth-service.service";
import {HttpService} from "../http.service";
import {UserService} from "./user-service.service";

import {mapMenteeDetails} from "../../mapper/api/apiToMenteeDetails.mapper";
import {UserType} from "../../../types/user-type.enum";
import {MenteeUser, UserDetails} from "../../../types/user.interface";

import {MenteeInfo} from "../../../types/user details/user-info.interface";
import {MenteeDetails} from "../../../types/user details/mentee.interface";
import {MenteeDetailsApi} from "../../../types/api/mentee-details-interface";
import mapMenteeDetailsToApiPayload from "../../mapper/menteeDetailsToApi.mapper";

@Injectable({
  providedIn: null
})
export class MenteeService implements OnInit {
  private readonly _router = inject(Router)

  private readonly _localStorageService = inject(LocalStorageService)
  private readonly _authService = inject(AuthServiceService)
  private readonly _userService = inject(UserService)

  private readonly apiService = inject(HttpService)

  ngOnInit(): void {
    const authToken = this._authService.getAccessToken();
    const userId = this._localStorageService.getItem("user_id") ;


    if (!authToken || !userId && this._router.url !== '/login' && !this._router.url.includes("/edit")) {
      this.throwUserUnauthorizedUser();
    }
  }

  throwUserUnauthorizedUser() {
    this._router.navigate(['/profile']);
  }

  menteeDetails(): Observable<MenteeDetails> {
    const menteeEndpoint = "users/mentee-details/?user_id=";

    return this._userService.userDetails().pipe(
      switchMap((userDetails) => {
        if (!userDetails.roles.includes(UserType.MENTEE)) {throw new Error('User is not a mentee');}
          const {id} = userDetails;

          return this.apiService.get(`${menteeEndpoint}${id}`).pipe(
            map((menteeDetails) => {
              return menteeDetails;
            })
          );

      }),
      take(1),
      map((menteeDetails) => {
        const [details] = menteeDetails as MenteeDetailsApi[];
        return mapMenteeDetails(details)
      }),
    )
  }

  menteeInfo (): Observable<MenteeInfo> {
    return this.menteeDetails().pipe(
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

  menteeUser(): Observable<MenteeUser> {
    const menteeEndpoint = "users/mentee-details/?user_id=";

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

        return this.apiService.get(`${menteeEndpoint}${id}`).pipe(
          map((menteeDetails) => {
            return menteeDetails;
          })
        );
      }),
      take(1),
      map((menteeDetails) => {
        const [details] = menteeDetails as MenteeDetailsApi[];
        return {
          ...userDetails,
          menteeDetails: {...mapMenteeDetails(details)}
        };
      })
    )
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

  deleteMenteeDetails(detailsId: string) {
    const menteeEndpoint = `users/mentee-details/${detailsId}/`;

    return this.apiService.delete(menteeEndpoint).pipe(
      take(1)
    )
  }



}
