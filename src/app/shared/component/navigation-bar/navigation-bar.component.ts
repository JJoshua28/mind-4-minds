import {Component, Signal, signal, WritableSignal} from '@angular/core';
import {NgClass} from "@angular/common";

enum NavigationItems {
  FIND_A_MENTOR="find a mentor",
  REQUESTS_AND_NOTIFICATION='requests and notifications',
}

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss'
})

export class NavigationBarComponent {
  $hasRequestsOrNotifications: WritableSignal<boolean> = signal<boolean>(true);
  $navigationItems: Signal<NavigationItems[]> = signal(Object.values(NavigationItems));


}
