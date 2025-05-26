import {Component, inject } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

enum NavigationItems {
  USER_DETAILS = "user-details",
  MENTOR_DETAILS = "mentor-details"
}

@Component({
  selector: 'app-sidebar-navigation',
  standalone: true,
  imports: [],
  templateUrl: './sidebar-navigation.component.html',
  styleUrl: './sidebar-navigation.component.scss'
})
export class SidebarNavigationComponent {
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);


  handleNavigateTo(navigationItem: NavigationItems) {
    this._router.navigate([`./${navigationItem}`], { relativeTo: this._route });
  }

  protected readonly NavigationItems = NavigationItems;
}
