import {
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  Signal,
  ViewChild,
  WritableSignal
} from '@angular/core';

import {Router} from "@angular/router";

import {
  ActionTypes,
  ConfirmActionModalComponent
} from "../../../../shared/component/confirm-action-modal/confirm-action-modal.component";
import {MenteeDetailsComponent} from "../../../../shared/component/mentee-details/mentee-details.component";
import {MenteeInfo} from "../../../../types/user details/user-info.interface";

import {UserService} from "../../../../shared/services/user/user-service.service";

import {MenteeDetails} from "../../../../types/user details/mentee.interface";
import {map, of, Subscription, switchMap, take} from "rxjs";
import {UserType} from "../../../../types/user-type.enum";
import {MenteeRepository} from "../../../../shared/repositories/mentee.repository";
import {UserDetails} from "../../../../types/user.interface";
import {UserRepository} from "../../../../shared/repositories/user.repository";

@Component({
  selector: 'app-mentee',
  standalone: true,
  imports: [
    ConfirmActionModalComponent,
    MenteeDetailsComponent,
  ],
  templateUrl: './mentee.component.html',
  styleUrl: './mentee.component.scss'
})
export class MenteeComponent implements OnInit, OnDestroy {
  private readonly _router = inject(Router);
  private readonly subscriptions: Subscription = new Subscription();

  private readonly menteeRepository = inject(MenteeRepository);
  private readonly userRepository = inject(UserRepository);

  private readonly _userService = inject(UserService);

  $isReady = signal(false);
  userDetailsId = input.required<string>();
  $userDetails!: Signal<UserDetails>;

  $menteeDetails!: WritableSignal<MenteeDetails>;

  $mentee!: Signal<MenteeInfo>;

  @ViewChild(ConfirmActionModalComponent) relinquishMenteeDutiesModal!: ConfirmActionModalComponent;
  protected readonly modalActionType = ActionTypes.DELETE;
  protected readonly modalMessageTopic = "leave your mentorship programme"

  ngOnInit() {
    this.subscriptions.add(
        this.menteeRepository.menteeUser(this.userDetailsId()).pipe(
        take(1)
      ).subscribe((menteeUser) => {
        this.$menteeDetails = signal(menteeUser.menteeDetails);
        this.$userDetails = signal({
          id: menteeUser.id,
          firstName: menteeUser.firstName,
          lastName: menteeUser.lastName,
          email: menteeUser.email,
          occupation: menteeUser.occupation,
          occupationStartDate: menteeUser.occupationStartDate,
          profilePic: menteeUser.profilePic,
          roles: menteeUser.roles,
          joined: menteeUser.joined,
          isArchived: menteeUser.isArchived,
          isAdmin: menteeUser.isAdmin,
          accountId: menteeUser.accountId
        });

        this.$mentee = computed((): MenteeInfo => {
          return {
            description: this.$menteeDetails().description,
            expectations: this.$menteeDetails().expectations,
            goals: this.$menteeDetails().goals,
            learningPreferences: this.$menteeDetails().learningPreferences,
            commitment: this.$menteeDetails().commitment,
            meetingPreferences: this.$menteeDetails().meetingPreferences,
            neurodivergentConditions: this.$menteeDetails().neurodivergentConditions,
          }
        });

        this.$isReady.set(true);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }


  navigateToEditPage() {
    const editMenteeDetailsUrl = `/mentee-details/edit/${this.userDetailsId()}`;
    this._router.navigate([editMenteeDetailsUrl]);
  }

  relinquishMenteeDuties() {
    const {profilePic, ...userDetails} = this.$userDetails();
    this.subscriptions.add(
      this.userRepository.updateUserDetails(
        {
          ...userDetails,
          roles: this.$userDetails().roles.filter((role) => role !== UserType.MENTEE)
        },
        this.$userDetails().id
      ).pipe(
        map((user) => {
          if(this.userDetailsId() === this._userService.$userDetails().id)
          {
            this._userService.updateData({
              id: user.id,
              profilePic: user.profilePic,
              roles: user.roles,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              occupation: user.occupation,
              occupationStartDate: user.occupationStartDate
            });
          }
          return of(null);
        }),
        switchMap(() => {
          return this.menteeRepository.deleteMenteeDetails(this.$menteeDetails().id)
        }),
      ).subscribe(() =>{
        const editMenteeDetailsUrl = `/user-details/${this.userDetailsId()}`;
        this._router.navigate([editMenteeDetailsUrl]);
      })
    )
  }

}
