  import {inject, Injectable, signal, WritableSignal} from '@angular/core';

  import {UserType} from "../../types/user-type.enum";


  import {MenteeInfo, MentorInfo, UserInfo} from "../../types/user details/user-info.interface";
  import {map, Observable, of, Subject, switchMap, take, tap} from "rxjs";
  import {LocalStorageService} from "../../shared/services/local-storage.service";

  import {HttpService} from "../../shared/services/http.service";
  import {mapUserFormToApiPayload} from "../../shared/mapper/userDetailsToApi.mapper";
  import mapMenteeDetailsToApiPayload from "../../shared/mapper/menteeDetailsToApi.mapper";
  import {User} from "../../types/user.interface";
  import {mapMentorDetailsToApiPayload} from "../../shared/mapper/mentorDetailsToApi.mapper";
  import {AuthServiceService, AuthToken} from "../../shared/services/auth-service.service";
  import {UserService} from "../../shared/services/user/user-service.service";
  import {UserAccount} from "../../types/api/user-account .interface";
  import {RequestsRepositoryService} from "../../shared/repositories/requests.repository.service";
  import {ActionType} from "../../types/action-type.enum";
  import {MenteeRepository} from "../../shared/repositories/mentee.repository";
  import {MentorRepository} from "../../shared/repositories/mentor.repository.service";
  import {MenteeDetailsApi} from "../../types/api/mentee-details-interface";
  import {MentorDetailsApi} from "../../types/api/mentor-details.interface";

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

    createUserRequest(accountDetails: RegistrationUserDetails, roles: UserType[], menteeDetails?: Partial<MenteeDetailsApi>, mentorDetails?: Partial<MentorDetailsApi>) {
      const {email, newPassword: password, ...info} = accountDetails;

      const userRegistration = mapUserFormToApiPayload(info, roles);

      return  {
        ...userRegistration,
        email,
        mentee_details: menteeDetails || undefined,
        mentor_details: mentorDetails || undefined,
        password: password as string,
      }

    }


    createUser (): Observable<User> {
      const registerUserEndpoint = "users/create/";

      const menteePayload = this.roles.includes(UserType.MENTEE)?
       mapMenteeDetailsToApiPayload(this.menteeDetails()) as MenteeDetailsApi : undefined;

      const mentorPayload = this.roles.includes(UserType.MENTOR)?
        mapMentorDetailsToApiPayload(this.mentorDetails()) as MentorDetailsApi : undefined;


      const userRegistrationData = this.createUserRequest(this.userDetails(), this.roles, menteePayload, mentorPayload);

      return this.apiService.post<UserAccount>(registerUserEndpoint, userRegistrationData).pipe(
        switchMap((user) => {
          if(user.roles.includes(UserType.ADMIN)) {
            const mentorRequestData = {
              sender: user.id,
              recipients: [],
              body: "I would like to request admin permissions on the system.",
              subject: "Admin Request",
              action_type: ActionType.ADMIN_PERMISSIONS,
            }

            this.requestService.createAdminRequest(mentorRequestData).pipe(
              take(1),
            ).subscribe()
          }
          return of(user);
        }),

        switchMap((userDetails) => {
          return this.getAuthenticationToken().pipe(
            map((authToken) => ({ user: userDetails, authToken }))
          );
        }),

        tap(({ authToken }) => {
          this._localStorageService.clear();
          const { access, refresh, user_id } = authToken;
          this._authService.setAccessToken(access);
          this._authService.setRefreshToken(refresh);
          this._localStorageService.setItem('user_id', user_id);
        }),
        switchMap(({ user }) => {
          return this._userService.initialiseData(user);
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
