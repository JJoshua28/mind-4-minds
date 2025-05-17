import {Component, EventEmitter, Input, input, Output} from '@angular/core';
import {NgClass} from "@angular/common";

enum MessageStatus {
  OLD = "old",
  NEW = "new",
}

interface Message {
  senderName: string;
  message?: string;
  subject: string;
  status: MessageStatus;
}

@Component({
  selector: 'app-message-snippet',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './message-snippet.component.html',
  styleUrl: './message-snippet.component.scss'
})
export class MessageSnippetComponent {
  $message = input.required<Message>();

  @Output() messageClicked = new EventEmitter<void>();

  handleMessageClick(): void {
    const isNewMessage = this.$message().status === MessageStatus.NEW;
      isNewMessage && this.messageClicked.emit();

  }
}
