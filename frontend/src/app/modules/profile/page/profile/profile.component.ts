import { Component } from '@angular/core';
import {SidebarNavigationComponent} from "../../components/sidebar-navigation/sidebar-navigation.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    SidebarNavigationComponent,
    RouterOutlet
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

}
