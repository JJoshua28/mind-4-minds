import {Component, signal, WritableSignal} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-requests-and-notification-bar',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './requests-and-notification-bar.component.html',
  styleUrl: './requests-and-notification-bar.component.scss'
})
export class RequestsAndNotificationBarComponent {
  $isViewingRequests: WritableSignal<boolean> = signal<boolean>(true);
  $hasNotifications: WritableSignal<boolean> = signal<boolean>(true);
  $hasRequests: WritableSignal<boolean> = signal<boolean>(true);
}
