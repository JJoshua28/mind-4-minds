import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {NavigationBarComponent} from "./shared/component/navigation-bar/navigation-bar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'mind-4-minds-app';
}
