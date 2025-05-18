import {Component, EventEmitter, input, Output} from '@angular/core';
import {NgClass} from "@angular/common";
import {CommunicationsStatus} from "../../../../types/message-status.enum";


export interface Snippet {
  senderName: string;
  message?: string;
  subject: string;
  date: string;
  status: CommunicationsStatus;
}

@Component({
  selector: 'app-communications-snippet',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './communications-snippet.component.html',
  styleUrl: './communications-snippet.component.scss',

})
export class CommunicationsSnippetComponent {
  $message = input.required<Snippet>();

  @Output() messageClicked = new EventEmitter<void>();

  handleMessageClick(): void {
    const isNewMessage = this.$message().status === CommunicationsStatus.NEW;
      isNewMessage && this.messageClicked.emit();

  }
}
