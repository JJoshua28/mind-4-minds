import {Component, signal, Signal} from '@angular/core';
import {NgClass} from "@angular/common";

interface Mentor {
  firstname: string;
  surname: string;
  occupation: string;
  description: string;
  mainSpeciality: string;
  specialities: Array<string>;
}

const placeholderMentor: Mentor = {
  firstname: "vorname",
  surname: "nachname",
  occupation: "carer",
  mainSpeciality: "ADHD",
  description: "Hi, I am vorname. I have been caring for my Autistic son for 13 years now. \n" +
    "I have experience helping him self-regulate and vibe.",
  specialities: ["ADHD", "leadership", "assessments"]
}

@Component({
  selector: 'app-mentor-card',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './mentor-card.component.html',
  styleUrl: './mentor-card.component.scss'
})

export class MentorCardComponent {
  mentor: Signal<Mentor> = signal(placeholderMentor);

}
