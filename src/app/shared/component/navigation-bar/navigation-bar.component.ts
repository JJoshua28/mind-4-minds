import {Component, Signal, signal, WritableSignal} from '@angular/core';
import {NgClass} from "@angular/common";

enum NavigationItems {
  FIND_A_MENTOR="find a mentor",
  REQUESTS_AND_NOTIFICATION='inbox',
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
  $hasNewInboxMessage: WritableSignal<boolean> = signal<boolean>(true);
  $navigationItems: Signal<NavigationItems[]> = signal(Object.values(NavigationItems));


}
