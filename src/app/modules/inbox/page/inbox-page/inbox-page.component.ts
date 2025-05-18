import {Component, signal, WritableSignal} from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

import {
  RequestsAndNotificationBarComponent
} from "../../components/requests-and-notification-bar/requests-and-notification-bar.component";
import {CommunicationsStatus} from "../../../../types/communications-status.enum";
import {CommunicationsSnippetComponent, Snippet} from "../../components/inbox-snippet/communications-snippet.component";
import {
  EditInboxSnippetBarComponent
} from "../../components/edit-inbox-snippet-bar/edit-inbox-snippet-bar.component";

@Component({
  selector: 'app-inbox-page',
  standalone: true,
  imports: [
    RequestsAndNotificationBarComponent,
    CommunicationsSnippetComponent,
    EditInboxSnippetBarComponent
  ],
  templateUrl: './inbox-page.component.html',
  styleUrl: './inbox-page.component.scss'
})
export class InboxPageComponent {
  $checkedMessages: WritableSignal<Array<string>> = signal([])

  $snippets: WritableSignal<Array<Snippet>> = signal(snippets)

  handleCheckMessageEvent (messageId: string): void {
    this.$checkedMessages.set(
      this.$checkedMessages().includes(messageId) ?
      this.$checkedMessages().filter(id => id !== messageId) : [...this.$checkedMessages(), messageId]
    );

    this.$snippets.set(
      this.$snippets().map((snippet) => snippet.id === messageId?
        {...snippet, isChecked: !snippet.isChecked} : snippet
      )
    )
  }

  handleCheckAllClicked() {
    const shouldUpdateAllMessages = this.$checkedMessages().length > 0;

    if(shouldUpdateAllMessages)
    {
      this.$snippets.set(
        this.$snippets().map((snippet) => this.$checkedMessages().includes(snippet.id)?
          {...snippet, isChecked: !snippet.isChecked} : snippet
        )
      )

      this.$checkedMessages.set([]);
    } else {

      this.$snippets.set(
        this.$snippets().map((snippet) => ({...snippet, isChecked: !snippet.isChecked}))
      )

      this.$checkedMessages.set(
        this.$snippets().map((snippet) => snippet.id)
      )
    }
  }


}

const snippets: Array<Snippet> = [
  {
      id: uuidv4(),
    senderName: "Vorname Nachname",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    subject: "Lorem ipsum dolor sit amet.",
    date: new Date().toLocaleString('en-GB', {
      dateStyle: "short",
      timeStyle: 'short'
    }),
    status: CommunicationsStatus.NEW,
    isChecked: false
  },
  {
    id: uuidv4(),
    senderName: "Nachname Vorname",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    subject: "Lorem ipsum dolor sit amet.",
    date: new Date().toLocaleString('en-GB', {
      dateStyle: "short",
      timeStyle: 'short'
    }),
    status: CommunicationsStatus.OLD,
    isChecked: false
  },  {
    id: uuidv4(),
    senderName: "Vorname Nachname",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    subject: "Lorem ipsum dolor sit amet.",
    date: new Date().toLocaleString('en-GB', {
      dateStyle: "short",
      timeStyle: 'short'
    }),
    status: CommunicationsStatus.NEW,
    isChecked: false
  },
  {
    id: uuidv4(),
    senderName: "Nachname Vorname",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    subject: "Lorem ipsum dolor sit amet.",
    date: new Date().toLocaleString('en-GB', {
      dateStyle: "short",
      timeStyle: 'short'
    }),
    status: CommunicationsStatus.OLD,
    isChecked: false
  },  {
    id: uuidv4(),
    senderName: "Vorname Nachname",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    subject: "Lorem ipsum dolor sit amet.",
    date: new Date().toLocaleString('en-GB', {
      dateStyle: "short",
      timeStyle: 'short'
    }),
    status: CommunicationsStatus.NEW,
    isChecked: false
  },
  {
    id: uuidv4(),
    senderName: "Nachname Vorname",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    subject: "Lorem ipsum dolor sit amet.",
    date: new Date().toLocaleString('en-GB', {
      dateStyle: "short",
      timeStyle: 'short'
    }),
    status: CommunicationsStatus.OLD,
    isChecked: false
  },  {
    id: uuidv4(),
    senderName: "Vorname Nachname",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    subject: "Lorem ipsum dolor sit amet.",
    date: new Date().toLocaleString('en-GB', {
      dateStyle: "short",
      timeStyle: 'short'
    }),
    status: CommunicationsStatus.NEW,
    isChecked: false
  },
  {
    id: uuidv4(),
    senderName: "Nachname Vorname",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    subject: "Lorem ipsum dolor sit amet.",
    date: new Date().toLocaleString('en-GB', {
      dateStyle: "short",
      timeStyle: 'short'
    }),
    status: CommunicationsStatus.OLD,
    isChecked: false
  },  {
    id: uuidv4(),
    senderName: "Vorname Nachname",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    subject: "Lorem ipsum dolor sit amet.",
    date: new Date().toLocaleString('en-GB', {
      dateStyle: "short",
      timeStyle: 'short'
    }),
    status: CommunicationsStatus.NEW,
    isChecked: false
  },
  {
    id: uuidv4(),
    senderName: "Nachname Vorname",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    subject: "Lorem ipsum dolor sit amet.",

    date: new Date().toLocaleString('en-GB', {
      dateStyle: "short",
      timeStyle: 'short'
    }),
    status: CommunicationsStatus.OLD,
    isChecked: false
  },
]
