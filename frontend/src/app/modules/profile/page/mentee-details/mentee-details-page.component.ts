import {Component, computed, inject, input, OnInit, Signal, ViewChild} from '@angular/core';
import {MeetingPreferences} from "../../../../types/user details/mentor/mentor.enum";
import {NeurodivergenceConditions} from "../../../../types/user details/neurodivergence.enum";
import {LearningPreferences} from "../../../../types/user details/learning-preferences.enum";
import {Router} from "@angular/router";

import {
  ActionTypes,
  ConfirmActionModalComponent
} from "../../../../shared/component/confirm-action-modal/confirm-action-modal.component";
import {MenteeDetailsComponent} from "../../../../shared/component/mentee-details/mentee-details.component";
import {MenteeInfo} from "../../../../types/user details/user-info.interface";
import {MenteeService} from "../../../../shared/services/user/mentee.service";
import {UserService} from "../../../../shared/services/user/user-service.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {MenteeDetails} from "../../../../types/user details/mentee.interface";
import {delay, switchMap} from "rxjs";
import {UserType} from "../../../../types/user-type.enum";
@Component({
  selector: 'app-mentee-details-page',
  standalone: true,
  imports: [
    ConfirmActionModalComponent,
    MenteeDetailsComponent
  ],
  providers: [
    UserService,
    MenteeService
  ],

  templateUrl: './mentee-details-page.component.html',
  styleUrl: './mentee-details-page.component.scss'
})
export class MenteeDetailsPageComponent {
  private readonly _router = inject(Router);

  private readonly menteeService = inject(MenteeService);
  private readonly userService = inject(UserService);

  $menteeDetails = toSignal(this.menteeService.menteeDetails()) as Signal<MenteeDetails>

  $mentee = computed((): MenteeInfo => {
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

  @ViewChild(ConfirmActionModalComponent) relinquishMenteeDutiesModal!: ConfirmActionModalComponent;
  protected readonly modalActionType = ActionTypes.DELETE;
  protected readonly modalMessageTopic = "leave your mentorship programme"


  navigateTo() {
    this._router.navigate(['/profile/mentee-details/edit']);
  }

  relinquishMenteeDuties() {

    this.userService.userDetails().pipe(
      switchMap((userDetails) => {
        const {profilePic, roles, ...details} = userDetails;
        const newRoles:UserType[] = roles.filter((role) => role !== UserType.MENTEE);

        return this.userService.updateUserDetails({...details, roles: newRoles})
      }),
    switchMap(() => {
      return this.menteeService.deleteMenteeDetails(this.$menteeDetails().id)
    }),
    delay(1500)
    ).subscribe(() =>{
      this._router.navigate(['/profile']);
    });
  }

}
