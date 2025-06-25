import {Component, computed, inject, input, OnInit, Signal, signal, ViewChild, WritableSignal} from '@angular/core';
import {Router} from "@angular/router";

import {MentorDetailsComponent} from "../../../../shared/component/mentor-details/mentor-details.component";
import {MentorUser} from "../../../../types/user.interface";
import {PreviewMentorCardComponent} from "../../components/preview-mentor-card/preview-mentor-card.component";
import {MentorInfo, UserInfo} from "../../../../types/user details/user-info.interface";

import {MentorService} from "../../../../shared/services/user/mentor.service";

import {UserService} from "../../../../shared/services/user/user-service.service";
import {
  ActionTypes,
  ConfirmActionModalComponent
} from "../../../../shared/component/confirm-action-modal/confirm-action-modal.component";
import {delay, switchMap} from "rxjs";
import {UserType} from "../../../../types/user-type.enum";

@Component({
  selector: 'app-mentor',
  standalone: true,
  imports: [
    MentorDetailsComponent,
    PreviewMentorCardComponent,
    ConfirmActionModalComponent
  ],
  providers: [
    UserService,
    MentorService
  ],
  templateUrl: './mentor.component.html',
  styleUrl: './mentor.component.scss'
})
export class MentorComponent implements OnInit {
  private readonly _router = inject(Router);

  private readonly _mentorService = inject(MentorService)
  private readonly userService = inject(UserService);


  @ViewChild(PreviewMentorCardComponent) previewMentorModal!: PreviewMentorCardComponent;

  $user!: WritableSignal<MentorUser>

  $mentorDetail!: Signal<UserInfo & MentorInfo>

  @ViewChild(ConfirmActionModalComponent) relinquishMentorDutiesModal!: ConfirmActionModalComponent;
  protected readonly modalActionType = ActionTypes.DELETE;
  protected readonly modalMessageTopic = "leave your mentorship programme"

  ngOnInit(): void {

    this._mentorService.mentorUser().subscribe((user) => {
      this.$user = signal(user)

      this.$mentorDetail = computed(() => ({...this.$user() as UserInfo, ...this.$user().mentorDetails}))
    })
  }

  navigateTo() {
    this._router.navigate(['/profile/mentor-details/edit']);
  }

  updateMentorStatus() {
    const currentMentorDetails = this.$user().mentorDetails;
    const updatedDetails = {
      ...currentMentorDetails,
      isAvailable: !currentMentorDetails.isAvailable,
    };

    this._mentorService.updateMentorDetails(updatedDetails).subscribe({
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

    this.userService.userDetails().pipe(
      switchMap((userDetails) => {
        const {profilePic, roles, ...details} = userDetails;
        const newRoles:UserType[] = roles.filter((role) => role !== UserType.MENTEE);

        return this.userService.updateUserDetails({...details, roles: newRoles})
      }),
      switchMap(() => {
        return this._mentorService.deleteMenteeDetails(this.$user().mentorDetails.id)
      }),
      delay(1500)
    ).subscribe(() =>{
      this._router.navigate(['/profile']);
    });
  }
}
