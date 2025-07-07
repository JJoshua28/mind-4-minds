import {Component, EventEmitter, input, Output} from '@angular/core';
import {NgClass} from "@angular/common";
import {CommunicationsStatus} from "../../../../types/communications-status.enum";
import {Snippet} from "../../../../types/snippet.interface";

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

  handleCheckboxClick(event: MouseEvent) {
    this.messageCheckboxClicked.emit(this.$message().id);
    event.stopPropagation();
  }
}
