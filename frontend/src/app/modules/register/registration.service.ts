  import {inject, Injectable, signal, WritableSignal} from '@angular/core';

  import {UserType} from "../../types/user-type.enum";


  import {MenteeInfo, MentorInfo, UserInfo} from "../../types/user details/user-info.interface";
  import {map, Observable, of, Subject, switchMap, take, tap} from "rxjs";
  import {LocalStorageService} from "../../shared/services/local-storage.service";

  import {HttpService} from "../../shared/services/http.service";
  import {mapUserFormToApiPayload} from "../../shared/mapper/userDetailsToApi.mapper";
  import mapMenteeDetailsToApiPayload from "../../shared/mapper/menteeDetailsToApi.mapper";
  import {UserDetails} from "../../types/user.interface";
  import {mapMentorDetailsToApiPayload} from "../../shared/mapper/mentorDetailsToApi.mapper";
  import {AuthServiceService, AuthToken} from "../../shared/services/auth-service.service";
  import {UserService} from "../../shared/services/user/user-service.service";
  import {UserAccount, UserAccountPayload} from "../../types/api/user-account .interface";
  import {ApiUserDetails} from "../../types/api/user-details.interface";
  import {RequestsRepositoryService} from "../../shared/repositories/requests.repository.service";
  import {ActionType} from "../../types/action-type.enum";
  import {MenteeRepository} from "../../shared/repositories/mentee.repository";
  import {MentorRepository} from "../../shared/repositories/mentor.repository.service";
  import {MenteeDetailsApi} from "../../types/api/mentee-details-interface";
  import {MentorDetailsApi} from "../../types/api/mentor-details.interface";
  import {toObservable} from "@angular/core/rxjs-interop";

  export interface RegistrationUserDetails extends Omit<UserInfo, 'profilePic'> {
    profilePic: File | null;
    storageProfilePic?: string;
    newPassword: string | null
  }

  @Injectable({

    providedIn: 'root'
  })
  export class RegistrationService {
    private _localStorageService = inject(LocalStorageService);
    private readonly apiService = inject(HttpService);
    private readonly _authService = inject(AuthServiceService);
    private readonly _userService = inject(UserService);
    private readonly requestService = inject(RequestsRepositoryService);
    private readonly _menteeRepository = inject(MenteeRepository)
    private readonly _mentorRepository = inject(MentorRepository)

    private _userDetails: WritableSignal<RegistrationUserDetails> = signal({
      ...this._localStorageService.getItem('userDetails') as Partial<RegistrationUserDetails>,
      storageProfilePic: this._localStorageService.getItem('profilePic') || {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        profilePic: null,
        occupation: '',
        occupationStartDate: '',
        roles: [],
        accountId: '',
        joined: '',
        isArchived: false,
        newPassword: '',
        isAdmin: false
      },
      profilePic: null
    } as RegistrationUserDetails);
    private _roles: WritableSignal<Array<UserType>> = signal(
      this._localStorageService.getItem('roles') || []
    );

    private _menteeDetails: WritableSignal<MenteeInfo> = signal(
      this._localStorageService.getItem('menteeDetails') as MenteeInfo || {
        description: '',
        goals: [],
        learningPreferences: [],
        expectations: '',
        neurodivergentConditions: [],
        meetingPreferences: [],
        commitment: ''
      }
    );

    private _mentorDetails: WritableSignal<MentorInfo> = signal(
      this._localStorageService.getItem('mentorDetails') as MentorInfo || {
        description: '',
        experience: '',
        qualifications: '',
        commitment: '',
        meetingPreferences: [],
        neurodivergentConditions: []
      }
    );

    private _navigateToNextSection: Subject<void> = new Subject<void>()
    private _registrationComplete: Subject<UserType[]> = new Subject<UserType[]>()

    get roles () {
      return this._roles();
    }

    get userDetails () {
      return this._userDetails;
    }

    get menteeDetails () {
      return this._menteeDetails;
    }

    get mentorDetails () {
      return this._mentorDetails;
    }

    initRegistrationFromLocalStorage() {
      this._roles.set(this._localStorageService.getItem('roles') || []);
      this._userDetails.set({
        ...this._localStorageService.getItem('userDetails'),
        storageProfilePic: this._localStorageService.getItem('profilePic') || undefined,
        profilePic: null,
      } as RegistrationUserDetails);
      this._menteeDetails.set(this._localStorageService.getItem('menteeDetails') as MenteeInfo|| this.menteeDetails());
      this._mentorDetails.set(this._localStorageService.getItem('mentorDetails') as MentorInfo|| this.mentorDetails());
      return of(true);
    }


    addRoles(roles: UserType[]) {
      this._roles.set(roles);
      this._localStorageService.setItem('roles', roles);
    }

    addUserDetails(details: RegistrationUserDetails) {
      this._userDetails.set(details);
      const {profilePic, ...rest} = details;
      this._localStorageService.setItem('userDetails', rest);
      if(profilePic) {
        try{
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            this._localStorageService.setItem('profilePic', base64);
          };
          reader.readAsDataURL(profilePic);
        } catch(error) {
          console.log("problem adding profile pic");
        }
      }
    }

    addMenteeDetails(menteeDetails: MenteeInfo) {
      this._menteeDetails.set(menteeDetails);
      this._localStorageService.setItem('menteeDetails', menteeDetails);
    }

    addMentorDetails(mentorDetails: MentorInfo) {
      this._mentorDetails.set(mentorDetails);
      this._localStorageService.setItem('mentorDetails', mentorDetails);
    }

    sectionNavigationObserver() {
      return this._navigateToNextSection.asObservable();
    }

    registrationCompleteObserver() {
      return this._registrationComplete.asObservable();
    }

    getAuthenticationToken () {
      const endpoint = "token"
      const {email, newPassword: password} = this.userDetails()

      return this.apiService.post<AuthToken>(endpoint, {email, password})
    }

    createUserRequest(details: RegistrationUserDetails): {email: string, password: string} {
      const {email, newPassword: password} = details
      return {
        email,
        password: password as string,
      }
    }

    createUserDetailsRequest(details: RegistrationUserDetails, roles: UserType[], userId: string): FormData {
      const { storageProfilePic, email, newPassword,...registration } = details;
      const userRegistration = mapUserFormToApiPayload(registration, roles)
      const formData = new FormData();

      for (const key in userRegistration) {
        if (Object.prototype.hasOwnProperty.call(userRegistration, key)) {
          const value = userRegistration[key as keyof typeof userRegistration];

          if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        }
      }

      formData.append('user', userId);

      return formData;
    }


    createUser (): Observable<UserDetails> {
      const usersEndpoint = 'users/accounts/';
      const userDetailsEndpoint = 'users/details/';
      const menteeDetailsEndpoint = 'users/mentee/';
      const mentorDetailsEndpoint = 'users/mentor-details/';

      const userRequest = this.createUserRequest(this.userDetails());

      return this.apiService.post<UserAccount>(usersEndpoint, userRequest).pipe(
        switchMap((user) => {
          const formData = this.createUserDetailsRequest(this.userDetails(), this.roles, user.id);
          return this.apiService.post<ApiUserDetails>(userDetailsEndpoint, formData);
        }),

        switchMap((userDetails) => {
          if (this.roles.includes(UserType.MENTEE)) {
            const menteePayload = mapMenteeDetailsToApiPayload(this.menteeDetails(), userDetails.id) as MenteeDetailsApi;
            return this._menteeRepository.createMentee(menteePayload).pipe(
              map(() => userDetails)
            );
          }
          return of(userDetails);
        }),

        switchMap((userDetails) => {
          if (this.roles.includes(UserType.MENTOR)) {
            const mentorPayload = mapMentorDetailsToApiPayload(this.mentorDetails(), userDetails.id) as MentorDetailsApi;
            return this._mentorRepository.createMentor(mentorPayload).pipe(
              map(() => userDetails)
            );
          }
          return of(userDetails);
        }),

        switchMap((userDetails) => {
          if(this.roles.includes(UserType.ADMIN)) {
            const mentorRequestData = {
              sender: userDetails.id,
              recipients: [],
              body: "I would like to request admin permissions on the system.",
              subject: "Admin Request",
              action_type: ActionType.ADMIN_PERMISSIONS,
            }

            this.requestService.createAdminRequest(mentorRequestData).pipe(
              take(1),
            ).subscribe()
          }
          return of(userDetails);
        }),

        switchMap((userDetails) => {
          return this.getAuthenticationToken().pipe(
            map((authToken) => ({ userDetails, authToken }))
          );
        }),

        tap(({ authToken }) => {
          this._localStorageService.clear();
          const { access, refresh, user_id } = authToken;
          this._authService.setAccessToken(access);
          this._authService.setRefreshToken(refresh);
          this._localStorageService.setItem('user_id', user_id);
        }),
        switchMap(({ userDetails }) => {
          return this._userService.initialiseData(userDetails);
        }),
        tap(() => {
          this._registrationComplete.next(this.roles);
        })
      );
    }


    navigateToNextSection() {
      this._navigateToNextSection.next();
    }
  }
