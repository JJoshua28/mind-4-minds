import {Component, signal, WritableSignal} from '@angular/core';
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

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    CommunicationsSnippetComponent,
    EditInboxSnippetBarComponent,
    RequestsAndNotificationBarComponent,
    ViewMessageModalComponent,
    UserSnippetComponent
  ],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class ManageUsersComponent {
  $checkedUsers: WritableSignal<Array<string>> = signal([])

  $snippets: WritableSignal<Array<UserDetails>> = signal(userDetails)

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

const userDetail: UserDetails = {
  email: "dfdfdfdf@dkdk",
  firstName: "vornamememe",
  lastName:"nachnamememe",
  roles: [UserType.ADMIN, UserType.MENTEE, UserType.MENTOR],
  id: "1",
  isArchived: false,
  occupation: null,
  occupationStartDate: null,
  joined: new Date().toDateString(),
  profilePic: "33"
}

const userDetails:UserDetails[] = [userDetail, {...userDetail, id: "2"}, {...userDetail, id:"3"}, {...userDetail, id: "4"}]
