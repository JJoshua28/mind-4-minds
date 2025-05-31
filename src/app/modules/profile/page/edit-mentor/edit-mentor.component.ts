import {Component, inject, signal, WritableSignal} from '@angular/core';
import {TextAreaInputComponent} from "../../../../shared/component/textarea-input/text-area-input.component";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MeetingPreferences, Specialities} from "../../../../types/user details/mentor/mentor.enum";
import {TitleCasePipe} from "@angular/common";

@Component({
  selector: 'app-edit-mentor',
  standalone: true,
  imports: [
    TextAreaInputComponent,
    ReactiveFormsModule,
    TitleCasePipe
  ],
  templateUrl: './edit-mentor.component.html',
  styleUrl: './edit-mentor.component.scss'
})
export class EditMentorComponent {
  private readonly _router = inject(Router);
  private readonly _formBuilder = inject(FormBuilder);

  specialities: Array<Specialities> = [...Object.values(Specialities)];
  meetingPreferences: Array<MeetingPreferences> = [...Object.values(MeetingPreferences)]


  currentMentorDetails = {
    meetingPreferences:
      [MeetingPreferences.ONLINE_MESSAGING, MeetingPreferences.VIDEO_CALLS],
    mainSpeciality: null,
    qualifications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    experience: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    specialities: [Specialities.leadership, Specialities.assessment],
    description: "Hi, I am vorname. I have been caring for my Autistic son for 13 years now. \n" +
    "I have experience helping him self-regulate and vibe.",
    isAvailable: false,
  }

  $mentorDetails:WritableSignal<FormGroup> = signal(this._formBuilder.group({
  meetingPreferences:[this.currentMentorDetails.meetingPreferences as Array<MeetingPreferences>, Validators.required],
  mainSpeciality: [this.currentMentorDetails.mainSpeciality],
  qualifications: [this.currentMentorDetails.qualifications],
  experience: [this.currentMentorDetails.experience],
  specialities: [this.currentMentorDetails.specialities as Array<Specialities>, Validators.required],
  description: [this.currentMentorDetails.description, Validators.required],
  isAvailable: [this.currentMentorDetails.isAvailable, Validators.required],
}));

  navigateTo() {
    this._router.navigate(['/profile/mentor-details']);
  }

  onUpdateSpeciality(speciality: Specialities ) {
    const specialities = this.$mentorDetails().get('specialities')?.value;
    if(specialities) {
      const newValue = specialities?.includes(speciality)?
        specialities?.filter((value: Specialities) => value != speciality) : [...specialities, speciality]

      this.$mentorDetails().patchValue({
        specialities: newValue,
      })

      this.$mentorDetails();

    }
    const mainSpeciality = this.$mentorDetails().get('mainSpeciality')?.value;
    mainSpeciality === speciality && this.$mentorDetails().patchValue({
      mainSpeciality: null
    });
  }

  onUpdateMeetingPreferences(meetingPreference: MeetingPreferences ) {
    const meetingPreferences = this.$mentorDetails().get('meetingPreferences')?.value;
    if(meetingPreferences) {
      const newValue = meetingPreferences?.includes(meetingPreference)?
        meetingPreferences?.filter((value: MeetingPreferences) => value != meetingPreference) : [...meetingPreferences, meetingPreference]

      this.$mentorDetails().patchValue({
        meetingPreferences: newValue,
      });
    }
  }

}
