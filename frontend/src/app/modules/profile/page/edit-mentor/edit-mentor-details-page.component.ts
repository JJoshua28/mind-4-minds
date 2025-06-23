import {Component, computed, inject, OnDestroy, OnInit, Signal, signal, ViewChild, WritableSignal} from '@angular/core';
import {TextAreaInputComponent} from "../../../../shared/component/textarea-input/text-area-input.component";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MeetingPreferences } from "../../../../types/user details/mentor/mentor.enum";
import {TitleCasePipe} from "@angular/common";
import {
  EditMentorDetailsComponent
} from "../../../../shared/component/edit-mentor-details/edit-mentor-details.component";
import {RegistrationService} from "../../../register/registration.service";
import {NeurodivergenceConditions} from "../../../../types/user details/neurodivergence.enum";
import {Subscription} from "rxjs";
import {MentorInfo, UserInfo} from "../../../../types/user details/user-info.interface";
import {MentorDetailsFormControl} from "../../../../types/user details/mentor/mentor-details-form.interface";
import {atLeastOneTrueValidator} from "../../../../shared/helpers/atLeastOneSelectedCheckboxValidation";
import {PreviewMentorCardComponent} from "../../components/preview-mentor-card/preview-mentor-card.component";

@Component({
  selector: 'app-edit-mentor-details-page',
  standalone: true,
  imports: [
    TextAreaInputComponent,
    ReactiveFormsModule,
    TitleCasePipe,
    EditMentorDetailsComponent,
    PreviewMentorCardComponent
  ],
  templateUrl: './edit-mentor-details-page.component.html',
  styleUrl: './edit-mentor-details-page.component.scss'
})

export class EditMentorDetailsPageComponent implements OnInit, OnDestroy {
  private readonly _router = inject(Router);
  private readonly _formBuilder = inject(FormBuilder);

  @ViewChild(PreviewMentorCardComponent) previewMentorModal!: PreviewMentorCardComponent;

  private readonly subscriptions: Subscription = new Subscription();

  private readonly registrationService = inject(RegistrationService);

  meetingPreferenceOptions = Object.values(MeetingPreferences);
  neurodivergentConditionOptions = Object.values(NeurodivergenceConditions);

  mentorDetails: MentorInfo = this.registrationService.mentorDetails;

  $user!:Signal<UserInfo & MentorInfo>;

  $mentorDetailsForm: WritableSignal<FormGroup<MentorDetailsFormControl>> = signal(this._formBuilder.group({
    description: this._formBuilder.nonNullable.control(this.mentorDetails?.description || "", [Validators.required]),
    qualifications: this._formBuilder.nonNullable.control(this.mentorDetails?.qualifications || "", [Validators.required]),
    commitment: this._formBuilder.nonNullable.control(this.mentorDetails?.commitment || "", [Validators.required]),
    experience: this._formBuilder.nonNullable.control(this.mentorDetails?.experience || ""),
    meetingPreferences: this._formBuilder.nonNullable.array(
      this.meetingPreferenceOptions.map(preference => {
        const defaultValue = this.mentorDetails?.meetingPreferences.includes(preference);
        return this._formBuilder.nonNullable.control(defaultValue)
      }),
      {validators: [atLeastOneTrueValidator]
      }
    ),
    neurodivergentConditions: this._formBuilder.nonNullable.array(
      this.neurodivergentConditionOptions.map(condition => {
        const defaultValue = this.mentorDetails?.neurodivergentConditions.includes(condition);
        return this._formBuilder.nonNullable.control(defaultValue)
      })
    ),

  }))

  ngOnInit() {
    this.subscriptions.add(
      this.$mentorDetailsForm().valueChanges.subscribe(() => {
        this.$user = computed(() => {
          const meetingPreferences: MeetingPreferences[] = this.meetingPreferenceOptions.filter((value, index) => this.$mentorDetailsForm()?.value?.meetingPreferences?.[index]);
          const neurodivergentConditions: NeurodivergenceConditions[] = this.neurodivergentConditionOptions.filter((value, index) => this.$mentorDetailsForm()?.value?.neurodivergentConditions?.[index]);
          const mentorInfo = {
            ...this.$mentorDetailsForm()?.value as Partial<MentorInfo>,
            meetingPreferences,
            neurodivergentConditions,
          } as MentorInfo;

          const userInfo = {
            firstName: this.registrationService.userDetails?.firstName,
            lastName: this.registrationService.userDetails?.lastName,
            email: this.registrationService.userDetails?.email,
            occupation: this.registrationService.userDetails?.occupation || null,
            occupationStartDate: this.registrationService.userDetails?.occupationStartDate || null,
            profilePic: this.registrationService.userDetails?.profilePic && URL.createObjectURL(this.registrationService?.userDetails?.profilePic as File) || "../../../../../assets/images/profilePic.png"
          } as UserInfo;
          return {
            ...userInfo,
            ...mentorInfo,
          }
        })
      })
    )

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  navigateTo() {
    this._router.navigate(['/profile/mentor-details']);
  }

}
