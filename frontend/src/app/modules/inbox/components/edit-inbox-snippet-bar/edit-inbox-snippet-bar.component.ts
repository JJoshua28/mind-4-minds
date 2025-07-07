import {Component, EventEmitter, input, Output} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-edit-inbox-snippet-bar',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './edit-inbox-snippet-bar.component.html',
  styleUrl: './edit-inbox-snippet-bar.component.scss'
})
export class EditInboxSnippetBarComponent {
  $tickCheckbox = input.required<boolean>();

  @Output() tickBoxClicked = new EventEmitter<void>();
  @Output() binClicked = new EventEmitter<void>();
}
