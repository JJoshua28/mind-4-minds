import {Component, computed, inject, input, OnInit, Signal, signal, ViewChild, WritableSignal} from '@angular/core';
import {Router} from "@angular/router";

import {MentorDetailsComponent} from "../../../../shared/component/mentor-details/mentor-details.component";
import {MentorUser} from "../../../../types/user.interface";
import {PreviewMentorCardComponent} from "../../components/preview-mentor-card/preview-mentor-card.component";
import {MentorInfo, UserInfo} from "../../../../types/user details/user-info.interface";

import {MentorService} from "../../../../shared/services/user/mentor.service";

import {UserService} from "../../../../shared/services/user/user-service.service";

@Component({
  selector: 'app-mentor',
  standalone: true,
  imports: [
    MentorDetailsComponent,
    PreviewMentorCardComponent
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

  @ViewChild(PreviewMentorCardComponent) previewMentorModal!: PreviewMentorCardComponent;

  $user!: WritableSignal<MentorUser>

  $mentorDetail!: Signal<UserInfo & MentorInfo>

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

}
