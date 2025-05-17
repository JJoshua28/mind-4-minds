import {Component, input} from '@angular/core';
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
  $isViewingRequests = input.required<boolean>();
  $hasNotifications = input.required<boolean>();
  $hasRequests = input.required<boolean>();
}
