import { Component } from '@angular/core';
import {Mentor} from "../../../../shared/types/mentor.interface";
import {MentorCardComponent} from "../../../../shared/component/mentor-card/mentor-card.component";

enum SearchType {
  ALL = "all",
  RELATED = "related",
}

@Component({
  selector: 'app-mentor-search-page',
  standalone: true,
  imports: [
    MentorCardComponent
  ],
  templateUrl: './mentor-search-page.component.html',
  styleUrl: './mentor-search-page.component.scss'
})
export class MentorSearchPageComponent {
  searchType: SearchType = SearchType.ALL;
  index: number = 1;

  placeholderMentors: Mentor[] = [
    {
      firstname: "vorname",
      surname: "nachname",
      occupation: "carer",
      mainSpeciality: "ADHD",
      description: "Hi, I am vorname. I have been caring for my Autistic son for 13 years now. \n" +
        "I have experience helping him self-regulate and vibe.",
      specialities: ["ADHD", "leadership", "assessments"],
      profilePic: "https://cdn.britannica.com/54/252154-050-881EE55B/janelle-monae-glass-onion-knives-out-film-premiere.jpg"
    },
    {
      firstname: "vorname",
      surname: "nachname",
      occupation: "carer",
      mainSpeciality: "ADHD",
      description: "Hi, I am vorname. I have been caring for my Autistic son for 13 years now. \n" +
        "I have experience helping him self-regulate and vibe.",
      specialities: ["ADHD", "leadership", "assessments"],
      profilePic: "https://cdn.britannica.com/54/252154-050-881EE55B/janelle-monae-glass-onion-knives-out-film-premiere.jpg"
    },
    {
      firstname: "vorname",
      surname: "nachname",
      occupation: "carer",
      mainSpeciality: "ADHD",
      description: "Hi, I am vorname. I have been caring for my Autistic son for 13 years now. \n" +
        "I have experience helping him self-regulate and vibe.",
      specialities: ["ADHD", "leadership", "assessments"],
      profilePic: "https://cdn.britannica.com/54/252154-050-881EE55B/janelle-monae-glass-onion-knives-out-film-premiere.jpg"
    },{
      firstname: "vorname",
      surname: "nachname",
      occupation: "carer",
      mainSpeciality: "ADHD",
      description: "Hi, I am vorname. I have been caring for my Autistic son for 13 years now. \n" +
        "I have experience helping him self-regulate and vibe.",
      specialities: ["ADHD", "leadership", "assessments"],
      profilePic: "https://cdn.britannica.com/54/252154-050-881EE55B/janelle-monae-glass-onion-knives-out-film-premiere.jpg"
    },{
      firstname: "vorname",
      surname: "nachname",
      occupation: "carer",
      mainSpeciality: "ADHD",
      description: "Hi, I am vorname. I have been caring for my Autistic son for 13 years now. \n" +
        "I have experience helping him self-regulate and vibe.",
      specialities: ["ADHD", "leadership", "assessments"],
      profilePic: "https://cdn.britannica.com/54/252154-050-881EE55B/janelle-monae-glass-onion-knives-out-film-premiere.jpg"
    },{
      firstname: "vorname",
      surname: "nachname",
      occupation: "carer",
      mainSpeciality: "ADHD",
      description: "Hi, I am vorname. I have been caring for my Autistic son for 13 years now. \n" +
        "I have experience helping him self-regulate and vibe.",
      specialities: ["ADHD", "leadership", "assessments"],
      profilePic: "https://cdn.britannica.com/54/252154-050-881EE55B/janelle-monae-glass-onion-knives-out-film-premiere.jpg"
    },{
      firstname: "vorname",
      surname: "nachname",
      occupation: "carer",
      mainSpeciality: "ADHD",
      description: "Hi, I am vorname. I have been caring for my Autistic son for 13 years now. \n" +
        "I have experience helping him self-regulate and vibe.",
      specialities: ["ADHD", "leadership", "assessments"],
      profilePic: "https://cdn.britannica.com/54/252154-050-881EE55B/janelle-monae-glass-onion-knives-out-film-premiere.jpg"
    }
  ];
}
