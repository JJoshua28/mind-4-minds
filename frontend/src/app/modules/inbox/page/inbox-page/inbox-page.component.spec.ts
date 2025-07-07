import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InboxPageComponent } from './inbox-page.component';
import { RequestsRepositoryService } from '../../../../shared/repositories/requests.repository.service';
import { UserService } from '../../../../shared/services/user/user-service.service';
import { MenteeMentorLinkRepositoryService } from '../../../../shared/repositories/mentee-mentor-link.repository.service';
import { UserRepository } from '../../../../shared/repositories/user.repository';
import { MentorRepository } from '../../../../shared/repositories/mentor.repository.service';
import { MenteeRepository } from '../../../../shared/repositories/mentee.repository';
import { ViewMessageModalComponent } from '../../components/view-message-modal/view-message-modal.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('InboxPageComponent', () => {
  let component: InboxPageComponent;
  let fixture: ComponentFixture<InboxPageComponent>;

  // jest mocks
  let requestsRepositoryMock: jest.Mocked<RequestsRepositoryService>;
  let userServiceMock: jest.Mocked<UserService>;
  let menteeMentorLinkRepositoryMock: jest.Mocked<MenteeMentorLinkRepositoryService>;
  let userRepositoryMock: jest.Mocked<UserRepository>;
  let mentorRepositoryMock: jest.Mocked<MentorRepository>;
  let menteeRepositoryMock: jest.Mocked<MenteeRepository>;

  beforeEach(async () => {
    requestsRepositoryMock = {
      getAllRequestForUser: jest.fn().mockReturnValue(of([])),
      updateRequest: jest.fn().mockReturnValue(of({})),
      deleteRequest: jest.fn().mockReturnValue(of({})),
      deleteMultipleRequests: jest.fn().mockReturnValue(of({}))
    } as unknown as jest.Mocked<RequestsRepositoryService>;

    userServiceMock = {
      $userDetails: jest.fn().mockReturnValue({ id: 'user1' })
    } as unknown as jest.Mocked<UserService>;

    menteeMentorLinkRepositoryMock = {
      createMenteeMentorLink: jest.fn().mockReturnValue(of({}))
    } as unknown as jest.Mocked<MenteeMentorLinkRepositoryService>;

    userRepositoryMock = {
      getUserDetailsById: jest.fn().mockReturnValue(of({ id: 'sender1', isArchived: false, email: 'test@test.com', accountId: 'acc1' })),
      updateUserAccount: jest.fn().mockReturnValue(of({}))
    } as unknown as jest.Mocked<UserRepository>;

    mentorRepositoryMock = {
      mentorDetails: jest.fn().mockReturnValue(of({ id: 'mentor1' }))
    } as unknown as jest.Mocked<MentorRepository>;

    menteeRepositoryMock = {
      menteeDetails: jest.fn().mockReturnValue(of({ id: 'mentee1' }))
    } as unknown as jest.Mocked<MenteeRepository>;

    await TestBed.configureTestingModule({
      imports: [InboxPageComponent],
      providers: [
        { provide: RequestsRepositoryService, useValue: requestsRepositoryMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: MenteeMentorLinkRepositoryService, useValue: menteeMentorLinkRepositoryMock },
        { provide: UserRepository, useValue: userRepositoryMock },
        { provide: MentorRepository, useValue: mentorRepositoryMock },
        { provide: MenteeRepository, useValue: menteeRepositoryMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(InboxPageComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllRequestForUser on init', () => {
    expect(requestsRepositoryMock.getAllRequestForUser).toHaveBeenCalledWith('user1');
  });

  it('should unsubscribe on destroy', () => {
    const unsubscribeSpy = jest.spyOn(component['_subscriptions'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should handle message click', () => {
    const mockRequest = { id: 'req1' } as any;
    component.viewSnippetModal = { show: jest.fn() } as unknown as ViewMessageModalComponent;
    component.handleMessageClicked(mockRequest);
    expect(component.selectedMessage).toEqual(mockRequest);
    expect(component.viewSnippetModal.show).toHaveBeenCalled();
  });

  it('should handle checking a message', () => {
    component.$snippets.set([{ id: 'req1', isChecked: false } as any]);
    component.handleCheckMessageEvent('req1');
    expect(component.$checkedMessages()).toContain('req1');
    expect(component.$snippets()[0].isChecked).toBe(true);
  });

  it('should handle check all clicked when messages are unchecked', () => {
    component.$snippets.set([{ id: 'req1', isChecked: false } as any]);
    component.handleCheckAllClicked();
    expect(component.$checkedMessages()).toContain('req1');
    expect(component.$snippets()[0].isChecked).toBe(true);
  });

  it('should handle check all clicked when messages are already checked', () => {
    component.$snippets.set([{ id: 'req1', isChecked: true } as any]);
    component.$checkedMessages.set(['req1']);
    component.handleCheckAllClicked();
    expect(component.$checkedMessages()).toEqual([]);
    expect(component.$snippets()[0].isChecked).toBe(false);
  });

});
