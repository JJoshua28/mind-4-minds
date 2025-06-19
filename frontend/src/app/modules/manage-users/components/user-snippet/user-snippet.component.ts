import {Component, EventEmitter, input, InputSignal, Output} from '@angular/core';
import {UserDetails} from "../../../../types/user.interface";

@Component({
  selector: 'app-user-snippet',
  standalone: true,
  imports: [],
  templateUrl: './user-snippet.component.html',
  styleUrl: './user-snippet.component.scss'
})
export class UserSnippetComponent {
  $userDetails: InputSignal<UserDetails> = input.required<UserDetails>();

  @Output() userSnippetClicked = new EventEmitter<string>();
  @Output() userCheckboxClicked = new EventEmitter<string>();

  $isChecked = input.required<boolean>();
}
