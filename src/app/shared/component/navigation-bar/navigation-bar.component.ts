import {Component, Signal, signal} from '@angular/core';

enum NavigationItems {
  FIND_A_MENTOR="find a mentor",
  REQUESTS_AND_NOTIFICATION='requests and notifications',
}

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss'
})

export class NavigationBarComponent {
  $navigationItems: Signal<NavigationItems[]> = signal(Object.values(NavigationItems));


}
