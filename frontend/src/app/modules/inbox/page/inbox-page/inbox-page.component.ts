import {Component, inject, OnDestroy, OnInit, PLATFORM_ID, signal, ViewChild, WritableSignal} from '@angular/core';

import {
  RequestsAndNotificationBarComponent
} from "../../components/requests-and-notification-bar/requests-and-notification-bar.component";
import {CommunicationsStatus} from "../../../../types/communications-status.enum";
import {CommunicationsSnippetComponent} from "../../components/inbox-snippet/communications-snippet.component";

import {ViewMessageModalComponent} from "../../components/view-message-modal/view-message-modal.component";
import {RequestsRepositoryService} from "../../../../shared/repositories/requests.repository.service";
import {UserService} from "../../../../shared/services/user/user-service.service";
import {combineLatest, flatMap, interval, startWith, Subscription, switchMap, take, tap} from "rxjs";
import {MenteeMentorLinkRepositoryService} from "../../../../shared/repositories/mentee-mentor-link.repository.service";
import {MentorRepository} from "../../../../shared/repositories/mentor.repository.service";
import {MenteeRepository} from "../../../../shared/repositories/mentee.repository";
import {Requests} from "../../../../types/requests.interface";
import {isPlatformBrowser} from "@angular/common";
import {EditInboxSnippetBarComponent} from "../../components/edit-inbox-snippet-bar/edit-inbox-snippet-bar.component";
import {ActionType} from "../../../../types/action-type.enum";
import {UserRepository} from "../../../../shared/repositories/user.repository";
import {UserType} from "../../../../types/user-type.enum";

@Component({
  selector: 'app-inbox-page',
  standalone: true,
  imports: [
    RequestsAndNotificationBarComponent,
    CommunicationsSnippetComponent,
    ViewMessageModalComponent,
    EditInboxSnippetBarComponent
  ],
  templateUrl: './inbox-page.component.html',
  styleUrl: './inbox-page.component.scss'
})
export class InboxPageComponent implements OnInit, OnDestroy {
  private readonly _platformId = inject(PLATFORM_ID);

  private readonly _subscriptions = new Subscription()
  private readonly _menteeMentorLinkRepository = inject(MenteeMentorLinkRepositoryService)
  private readonly _userRepository = inject(UserRepository)

  @ViewChild(ViewMessageModalComponent) viewSnippetModal!: ViewMessageModalComponent;


  $checkedMessages: WritableSignal<Array<string>> = signal([])
  private readonly _requestsRepository = inject(RequestsRepositoryService);
  private readonly _mentorRepository = inject(MentorRepository)
  private readonly _menteeRepository = inject(MenteeRepository)

  private readonly _userService = inject(UserService)

  $snippets: WritableSignal<Array<Requests>> = signal([]);
  $hasNewRequests: WritableSignal<boolean> = signal(false);

  selectedMessage!: Requests;

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      this._subscriptions.add(
        interval(30000).pipe(
          startWith(0),
          switchMap(() => this._requestsRepository.getAllRequestForUser(this._userService.$userDetails().id))
        ).subscribe((requests) => {
          this._updateSnippets(requests);
        })
      );
    }

  }

  private _updateSnippets(requests: Requests[]) {
    this.$snippets.set(
      requests.length> 0 ? requests.map(request =>
        this.$checkedMessages().includes(request.id) ? { ...request, isChecked: true } : request
      ) : []
    );
    if (this.$snippets().length > 0) {
      this.selectedMessage = requests[0];
      this.$hasNewRequests.set(this.$snippets().some(snippet => snippet.status === CommunicationsStatus.NEW));
    } else {
      this.$hasNewRequests.set(false);
    }
  }


  ngOnDestroy() {
    this._subscriptions.unsubscribe()
  }

  handleAction () {
    switch(this.selectedMessage.actionType) {
      case ActionType.ADD_MENTOR:
        this.addMentorToMentee();
        break;
      case ActionType.ADMIN_PERMISSIONS:
        this.addAdminPermission();
        break;
    }
  }

  addMentorToMentee() {
    combineLatest([
      this._menteeRepository.menteeDetails(this.selectedMessage.senderId),
      this._mentorRepository.mentorDetails(this._userService.$userDetails().id),
    ]).pipe(
      take(1),
      switchMap(([menteeDetails, mentorDetails]) => {
        return this._menteeMentorLinkRepository.createMenteeMentorLink(mentorDetails.id, menteeDetails.id)
      }),
      take(1)
    ).subscribe()
  }

  addAdminPermission() {
    this._userRepository.getUserDetailsById(this.selectedMessage.senderId).pipe(
      take(1),
      switchMap((userDetails) => {
        const accountUpdates = {
          isArchived: userDetails.isArchived,
          isAdmin: true,
          email: userDetails.email
        };
        return this._userRepository.updateUserAccount(accountUpdates, userDetails.accountId).pipe(
          take(1),
        )
      })
    ).subscribe(() => {
    });
  }

  updateMessageAction() {
    this._requestsRepository.updateRequest({
      ...this.selectedMessage,
      isComplete: true
    }).pipe(
      take(1),
      switchMap(() => {
        return this._requestsRepository.getAllRequestForUser(this._userService.$userDetails().id)
      }),
      take(1)
    ).subscribe((requests) => {
      this._updateSnippets(requests)
    })
  }

  handleMessageClicked(requests: Requests) {
    this.selectedMessage = requests;
    this.viewSnippetModal.show();
  }

  updateMessageStatus(requests: Requests) {

    requests.status === CommunicationsStatus.NEW && this._requestsRepository.updateRequest({
      ...requests,
      status: CommunicationsStatus.OLD
    }).pipe(
      take(1),
      switchMap(() => {
        return this._requestsRepository.getAllRequestForUser(this._userService.$userDetails().id)
      }),
      take(1)
    ).subscribe((requests) => {
      this._updateSnippets(requests)
    })
  }


  deleteMessage(messageId: string) {
    this._requestsRepository.deleteRequest(messageId).pipe(
      take(1),
      switchMap(() => {
        return this._requestsRepository.getAllRequestForUser(this._userService.$userDetails().id)
      }),
      take(1)
    ).subscribe((requests) => {
      this._updateSnippets(requests)
    })
  }

  deleteMultipleMessages() {
    this._requestsRepository.deleteMultipleRequests(this.$checkedMessages()).pipe(
      take(1),
      switchMap(() => {
        return this._requestsRepository.getAllRequestForUser(this._userService.$userDetails().id)
      }),
      take(1)
    ).subscribe((requests) => {
      this._updateSnippets(requests)
      this.$checkedMessages.set([])
    })
  }

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
