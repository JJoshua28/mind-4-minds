import {Component, input} from '@angular/core';

enum MeetingPreferences {
  ONLINE_MESSAGING= "online messaging",
  FACE_2_FACE= "face to face",
  VIDEO_CALLS= "video calls",
}

enum Specialities {
  adhd = "adhd",
  leadership = "leadership",
  assessment = "assessment",
}
interface MentorDetails {
  meetingPreference: Array<MeetingPreferences>
  mainSpeciality: Specialities;
  specialities: Array<Specialities>;
  description: string;
  isAvailable: boolean;
}

@Component({
  selector: 'app-mentor',
  standalone: true,
  imports: [],
  templateUrl: './mentor.component.html',
  styleUrl: './mentor.component.scss'
})
export class MentorComponent {
  mentorDetails = input({
    meetingPreference: [MeetingPreferences.ONLINE_MESSAGING, MeetingPreferences.VIDEO_CALLS],
    mainSpeciality: Specialities.adhd,
    specialities: [Specialities.adhd, Specialities.leadership, Specialities.assessment],
    description: "Hi, I am vorname. I have been caring for my Autistic son for 13 years now. \n" +
      "I have experience helping him self-regulate and vibe.",
    isAvailable: false,
  })

}
