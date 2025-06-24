import {Component, computed, inject, Signal, signal, ViewChild, WritableSignal} from '@angular/core';

import {RegistrationService } from "../../registration.service";
import {UserType} from "../../../../types/user-type.enum";
import {MenteeInfo, MentorInfo, UserInfo} from "../../../../types/user details/user-info.interface";
import {CardInfo, UserCardComponent} from "../../../../shared/component/user-card/user-card.component";
import {ViewMentorModalComponent} from "../../../../shared/component/view-mentor-modal/view-mentor-modal.component";
import {ViewMenteeModalComponent} from "../../../../shared/component/view-mentee-modal/view-mentee-modal.component";


@Component({
  selector: 'app-review-registration-page',
  standalone: true,
  imports: [
    UserCardComponent,
    ViewMentorModalComponent,
    ViewMenteeModalComponent
  ],
  templateUrl: './review-registration-page.component.html',
  styleUrl: './review-registration-page.component.scss'
})
export class ReviewRegistrationPageComponent {
  @ViewChild(ViewMentorModalComponent) viewMentorModal!: ViewMentorModalComponent;
  @ViewChild(ViewMenteeModalComponent) viewMenteeModal!: ViewMenteeModalComponent;

  private readonly registrationService: RegistrationService = inject(RegistrationService);

  $errorText: WritableSignal<string> = signal("");

  $guidelineText: Signal<string> = signal(
    this.registrationService.roles.includes(UserType.MENTEE)?
      "find someone to help that can help you reach your goals!" : "help others reach their goals!"
  )

  $userInfo: Signal<UserInfo> = signal({
    firstName: this.registrationService.userDetails?.firstName,
    lastName: this.registrationService.userDetails?.lastName,
    email: this.registrationService.userDetails?.email,
    occupation: this.registrationService.userDetails?.occupation,
    occupationStartDate: this.registrationService.userDetails?.occupationStartDate || null,
    profilePic: this.registrationService.userDetails?.storageProfilePic || "",
  })

  shouldLoadMenteeDetail = this.registrationService.roles.includes(UserType.MENTEE)
  shouldLoadMentorDetail = this.registrationService.roles.includes(UserType.MENTOR)

  $menteeInfo: Signal<MenteeInfo> = signal(this.registrationService.menteeDetails)
  $mentorInfo: Signal<MentorInfo> = signal(this.registrationService.mentorDetails)

  mentorUserType: UserType = UserType.MENTOR;
  menteeUserType: UserType = UserType.MENTEE;

  $mentorCardInfo = computed((): CardInfo => {
    return {
      ...this.$userInfo(),
      occupationStartDate: this.$userInfo().occupationStartDate,
      description: this.$mentorInfo().description,
      neurodivergentConditions: this.$mentorInfo().neurodivergentConditions,
    }
  })

  $menteeCardInfo = computed((): CardInfo => {
    return {
      ...this.$userInfo(),
      description: this.$menteeInfo().description,
      neurodivergentConditions: this.$menteeInfo().neurodivergentConditions,
    }
  })

  completeRegistration() {
    this.registrationService.createUser().subscribe({
      error: error => {
        this.$errorText.set(error.message);
      }
    });
  }
}
