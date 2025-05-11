import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MentorCardComponent} from "./modules/mentor-card/mentor-card.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MentorCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'mind-4-minds-app';
}
