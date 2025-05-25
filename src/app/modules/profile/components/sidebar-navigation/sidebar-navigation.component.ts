import {Component, signal, WritableSignal} from '@angular/core';


@Component({
  selector: 'app-sidebar-navigation',
  standalone: true,
  imports: [],
  templateUrl: './sidebar-navigation.component.html',
  styleUrl: './sidebar-navigation.component.scss'
})
export class SidebarNavigationComponent {
  items: WritableSignal<Array<string>> = signal<Array<string>>([
    "user details",
    "mentor details",
    "become a mentee"
  ]);

}
