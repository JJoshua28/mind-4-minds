import {Component, ElementRef, EventEmitter, input, Output, signal, ViewChild, WritableSignal} from '@angular/core';
import {NgClass} from "@angular/common";

export enum ActionTypes {
  CONFIRM = "confirm",
  DELETE = "delete"
}

@Component({
  selector: 'app-confirm-action-modal',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './confirm-action-modal.component.html',
  styleUrl: './confirm-action-modal.component.scss'
})
export class ConfirmActionModalComponent {
  @ViewChild('relinquishMentorDutiesModal') modal!: ElementRef<HTMLDialogElement>;

  @Output() hasConfirmedAction = new EventEmitter<void>();
  $type = input.required<ActionTypes>()
  $messageTopic = input.required<string>()

  isHidden: WritableSignal<boolean>= signal(true);

  show () {
    this.isHidden.set(!this.isHidden());
    this.modal.nativeElement.showModal()
  }

  close () {
    this.isHidden.set(!this.isHidden());

    this.modal.nativeElement.close();
  }


  protected readonly ActionTypes = ActionTypes;
}
