import { map, of, switchMap, take, tap} from "rxjs";
import {Component, computed, inject, input, OnInit, Signal, signal, ViewChild, WritableSignal} from '@angular/core';
import {Router} from "@angular/router";

import {MentorDetailsComponent} from "../../../../shared/component/mentor-details/mentor-details.component";
import {MentorUser, UserDetails} from "../../../../types/user.interface";
import {MentorInfo, UserInfo} from "../../../../types/user details/user-info.interface";
import {UserType} from "../../../../types/user-type.enum";

import {UserService} from "../../../../shared/services/user/user-service.service";
import {MentorRepository} from "../../../../shared/repositories/mentor.repository.service";
import {UserRepository} from "../../../../shared/repositories/user.repository";

import {
  ActionTypes,
  ConfirmActionModalComponent
} from "../../../../shared/component/confirm-action-modal/confirm-action-modal.component";
import {PreviewMentorCardComponent} from "../preview-mentor-card/preview-mentor-card.component";

@Component({
  selector: 'app-mentor',
  standalone: true,
  imports: [
    MentorDetailsComponent,
    PreviewMentorCardComponent,
    ConfirmActionModalComponent
  ],
  templateUrl: './mentor.component.html',
  styleUrl: './mentor.component.scss'
})
export class MentorComponent implements OnInit {
  private readonly _router = inject(Router);

  private readonly _mentorRepository = inject(MentorRepository);
  private readonly _userRepository = inject(UserRepository);
  private readonly _userService = inject(UserService);


  @ViewChild(PreviewMentorCardComponent) previewMentorModal!: PreviewMentorCardComponent;

  userDetailsId = input.required<string>()
  $isReady = signal(false);

  $user!: WritableSignal<MentorUser>

  $mentorDetail!: Signal<UserInfo & MentorInfo>

  @ViewChild(ConfirmActionModalComponent) relinquishMentorDutiesModal!: ConfirmActionModalComponent;
  protected readonly modalActionType = ActionTypes.DELETE;
  protected readonly modalMessageTopic = "leave your mentorship programme"

  ngOnInit(): void {
    this._mentorRepository.mentorUser(this.userDetailsId()).pipe(
      tap((user) => {
        if (!user) {
          this.navigateToEdit();
        }
      })
    ).subscribe((user) => {
      if (user) {
        this.$user = signal(user);
        this.$mentorDetail = computed(() => ({
          ...this.$user() as UserInfo,
          ...this.$user().mentorDetails
        }));

        this.$isReady.set(true);
      }
    });
  }

  navigateToEdit() {
    this._router.navigate([`/mentor-details/edit/${this.userDetailsId()}`]);
  }

  updateMentorStatus() {
    const currentMentorDetails = this.$user().mentorDetails;
    const updatedDetails = {
      ...currentMentorDetails,
      isAvailable: !currentMentorDetails.isAvailable,
    };

    this._mentorRepository.updateMentorDetails(updatedDetails).
    pipe(take(1)).subscribe({
      next: (updatedMentorDetails) => {
        this.$user.update(user => ({
          ...user,
          mentorDetails: updatedMentorDetails
        }));
      },
      error: (err) => {
        console.error("Failed to update mentor availability:", err);
      }
    });
  }

  relinquishMentorDuties() {
    const {mentorDetails, profilePic, ...userDetails} = this.$user();
    const newRoles = userDetails.roles.filter(role => role !== UserType.MENTOR);

    this._userRepository.updateUserDetails({...userDetails, roles: newRoles}, userDetails.id).pipe(
      take(1),
      map((user) => {
        if(this.userDetailsId() === this._userService.$userDetails().id) {
          const updatedUserDetails = {
            id: user.id,
            profilePic: user.profilePic,
            roles: user.roles,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            occupation: user.occupation,
            occupationStartDate: user.occupationStartDate
          }
          this._userService.updateData(updatedUserDetails);
          return of(null);
        }
        return of(null)
      }),
      switchMap(() => {
        return this._mentorRepository.deleteMentorDetails(mentorDetails.id)
      }),
      take(1),
    ).subscribe(() => {
      const editMentorDetailsUrl = `/user-details/${this.userDetailsId()}`;
      this._router.navigate([editMentorDetailsUrl]);
    });
  }
}
