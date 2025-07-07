import {
  Component,
  ElementRef, EventEmitter,
  inject,
  input,
  OnInit,
  Output,
  Signal,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import {User} from "../../../../types/user.interface";

import {UserType} from "../../../../types/user-type.enum";
import {UserRepository} from "../../../../shared/repositories/user.repository";
import {map, of, switchMap, take, tap} from "rxjs";
import {MenteeDetailsComponent} from "../../../../shared/component/mentee-details/mentee-details.component";
import {ActionType} from "../../../../types/action-type.enum";

import {MenteeRepository} from "../../../../shared/repositories/mentee.repository";
import {MenteeInfo} from "../../../../types/user details/user-info.interface";
import {Requests} from "../../../../types/requests.interface";

@Component({
  selector: 'app-view-message-modal',
  standalone: true,
  imports: [

    MenteeDetailsComponent
  ],
  templateUrl: './view-message-modal.component.html',
  styleUrl: './view-message-modal.component.scss'
})
export class ViewMessageModalComponent implements OnInit{
  private readonly userRepository = inject(UserRepository)
  private readonly menteeRepository = inject(MenteeRepository)

  @ViewChild('modal') modal!: ElementRef<HTMLDialogElement>;

  @Output() requestDeclined = new EventEmitter<void>()
  @Output() requestAccepted = new EventEmitter<void>()
  @Output() modalClosed = new EventEmitter<void>()

  $hasActions = input<boolean>(false)

  $message = input.required<Requests>()

  $user!: WritableSignal<User>;

  $mentee!: Signal<MenteeInfo>

  $isReady = signal(false)

  actionType = ActionType;

  ngOnInit() {
    this.userRepository.getUserById(this.$message().senderId).pipe(
      take(1),
      tap((user: User) => {
        this.$user = signal(user);
      }),
      switchMap((user: User) => {
        if (user.roles?.includes(UserType.MENTEE)) {
          return this.menteeRepository.menteeInfo(user.id).pipe(
            tap((mentee: MenteeInfo) => {
              this.$mentee = signal(mentee);
            }),
            map(() => null)
          );
        } else {
          return of(null);
        }
      }),
      take(1)
    ).subscribe(() => {
      this.$isReady.set(true)
    });
  }



  show () {
    this.modal.nativeElement.showModal()
  }

  close () {
    this.modal.nativeElement.close();
  }

}
