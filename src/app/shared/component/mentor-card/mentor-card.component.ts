import {Component, input, signal, Signal, WritableSignal} from '@angular/core';
import {NgClass} from "@angular/common";
import {Mentor} from "../../types/mentor.interface";


const placeholderMentor: Mentor = {
  firstname: "vorname",
  surname: "nachname",
  occupation: "carer",
  mainSpeciality: "ADHD",
  description: "Hi, I am vorname. I have been caring for my Autistic son for 13 years now. \n" +
    "I have experience helping him self-regulate and vibe.",
  specialities: ["ADHD", "leadership", "assessments"],
  profilePic: "https://cdn.britannica.com/54/252154-050-881EE55B/janelle-monae-glass-onion-knives-out-film-premiere.jpg"
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
  public readonly mentor  = input.required<Mentor>();

}
