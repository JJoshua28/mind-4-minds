import {Component, EventEmitter, input, Output} from '@angular/core';
import {NgClass} from "@angular/common";
import {CommunicationsStatus} from "../../../../types/communications-status.enum";


export interface Snippet {
  id: string;
  senderName: string;
  message?: string;
  subject: string;
  date: string;
  isChecked: boolean;
  status: CommunicationsStatus;
}

@Component({
  selector: 'app-inbox-snippet',
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
  @Output() messageCheckboxClicked = new EventEmitter<string>();

  handleMessageClick(): void {
    const isNewMessage = this.$message().status === CommunicationsStatus.NEW;
      isNewMessage && this.messageClicked.emit();
  }

  handleCheckboxClick(event: MouseEvent) {
    this.messageCheckboxClicked.emit(this.$message().id);
    event.stopPropagation();
  }
}
