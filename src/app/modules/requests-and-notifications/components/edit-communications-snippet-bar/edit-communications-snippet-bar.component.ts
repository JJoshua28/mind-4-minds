import {Component, EventEmitter, input, Output} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-edit-communications-snippet-bar',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './edit-communications-snippet-bar.component.html',
  styleUrl: './edit-communications-snippet-bar.component.scss'
})
export class EditCommunicationsSnippetBarComponent {
  $tickCheckbox = input.required<boolean>();

  @Output() tickBoxClicked = new EventEmitter<void>();

}
