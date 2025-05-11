import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MentorCardComponent} from "./shared/component/mentor-card/mentor-card.component";
import {MentorSearchPageComponent} from "./modules/mentor-search/page/mentor-search-page/mentor-search-page.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MentorCardComponent, MentorSearchPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'mind-4-minds-app';
}
