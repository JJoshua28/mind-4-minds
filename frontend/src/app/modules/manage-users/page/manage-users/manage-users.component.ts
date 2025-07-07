import {Component, inject, OnInit, Signal, signal, ViewChild, WritableSignal} from '@angular/core';
import {CommunicationsSnippetComponent} from "../../../inbox/components/inbox-snippet/communications-snippet.component";
import {
  EditInboxSnippetBarComponent
} from "../../../inbox/components/edit-inbox-snippet-bar/edit-inbox-snippet-bar.component";
import {
  RequestsAndNotificationBarComponent
} from "../../../inbox/components/requests-and-notification-bar/requests-and-notification-bar.component";
import {ViewMessageModalComponent} from "../../../inbox/components/view-message-modal/view-message-modal.component";
import {UserDetails} from "../../../../types/user.interface";
import {UserSnippetComponent} from "../../components/user-snippet/user-snippet.component";
import {UserType} from "../../../../types/user-type.enum";
import {UserService} from "../../../../shared/services/user/user-service.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {
  ActionTypes,
  ConfirmActionModalComponent
} from "../../../../shared/component/confirm-action-modal/confirm-action-modal.component";
import {map, switchMap, take} from "rxjs";
import {UserRepository} from "../../../../shared/repositories/user.repository";
import {Router} from "@angular/router";

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    EditInboxSnippetBarComponent,
    UserSnippetComponent,
    ConfirmActionModalComponent
  ],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class ManageUsersComponent implements OnInit {
  private readonly _router = inject(Router);

  protected readonly userService = inject(UserService);
  private readonly _userRepository = inject(UserRepository);

  @ViewChild(ConfirmActionModalComponent) confirmActionModal!: ConfirmActionModalComponent;

  $checkedUsers: WritableSignal<Array<string>> = signal([])

  $snippets: WritableSignal<Array<UserDetails>> = signal([]);

  protected readonly modalMessageTopic = "delete the selected users";
  protected readonly modalActionType = ActionTypes.DELETE;

  ngOnInit() {
    if(this.userService.$userDetails().isAdmin) {
      this._userRepository.getAllUserDetails(this.userService.$userDetails().id).pipe(
        take(1),
        map((users) => users.filter((user) => user.id !== this.userService.$userDetails().id))
      ).subscribe((users) => {
        this.$snippets.set(users);
      });
    }
  }

  navigateToUserDetails(userId: string) {
    this._router.navigate([`/user-details/${userId}`]);
  }

  handleUserCheckboxClicked (userAccountId: string): void {
    this.$checkedUsers.set(
      this.$checkedUsers().includes(userAccountId) ?
        this.$checkedUsers().filter(id => id !== userAccountId) : [...this.$checkedUsers(), userAccountId]
    );
  }

  handleCheckAllClicked() {
    const shouldUpdateAllUsers = this.$checkedUsers().length > 0;

    if(shouldUpdateAllUsers) this.$checkedUsers.set([]);
    else this.$checkedUsers.set(
        this.$snippets().map((snippet) => snippet.accountId)
      )
  }

  handleDeleteUsers() {
    this._userRepository.deleteMultipleUsers(this.$checkedUsers()).pipe(
      take(1),
      switchMap(() => this._userRepository.getAllUserDetails(this.userService.$userAccountId())),
      take(1)
    ).subscribe((response) => {
      this.$snippets.set(response);
      this.$checkedUsers.set([]);
    });
  }

}
