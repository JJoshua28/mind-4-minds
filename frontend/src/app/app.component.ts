import {Component, inject, OnDestroy } from '@angular/core';
import { RouterOutlet} from '@angular/router';
import {UserService} from "./shared/services/user/user-service.service";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {
  private readonly _userService = inject(UserService)




  ngOnDestroy(): void {
    this._userService.subscriptions.unsubscribe();
  }

}
