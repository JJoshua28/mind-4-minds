import {Component, inject, Signal, signal, WritableSignal} from '@angular/core';
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

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    EditInboxSnippetBarComponent,
    UserSnippetComponent
  ],
  providers: [
    UserService,
  ],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class ManageUsersComponent {
  private readonly userService = inject(UserService);
  $checkedUsers: WritableSignal<Array<string>> = signal([])

  $snippets: Signal<Array<UserDetails>> = toSignal(this.userService.getAllUserDetails()) as Signal<UserDetails[]>;

  selectedUser!: UserDetails;

  handleUserCheckboxClicked (userId: string): void {
    this.$checkedUsers.set(
      this.$checkedUsers().includes(userId) ?
        this.$checkedUsers().filter(id => id !== userId) : [...this.$checkedUsers(), userId]
    );
  }

  handleCheckAllClicked() {
    const shouldUpdateAllUsers = this.$checkedUsers().length > 0;

    if(shouldUpdateAllUsers) this.$checkedUsers.set([]);
    else this.$checkedUsers.set(
        this.$snippets().map((snippet) => snippet.id)
      )

  }

}
