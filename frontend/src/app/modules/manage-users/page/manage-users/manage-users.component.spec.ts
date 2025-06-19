import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageUsersComponent } from './manage-users.component';
import { UserDetails } from '../../../../types/user.interface';
import { UserType } from '../../../../types/user-type.enum';

describe('ManageUsersComponent', () => {
  let component: ManageUsersComponent;
  let fixture: ComponentFixture<ManageUsersComponent>;

  const userDetails: UserDetails[] = [
    {
      id: '1',
      email: 'test1@example.com',
      firstName: 'Test',
      lastName: 'One',
      roles: [UserType.MENTEE],
      isArchived: false,
      occupation: null,
      occupationStartDate: null,
      joined: new Date().toDateString(),
      profilePic: 'pic1'
    },
    {
      id: '2',
      email: 'test2@example.com',
      firstName: 'Test',
      lastName: 'Two',
      roles: [UserType.MENTOR],
      isArchived: false,
      occupation: null,
      occupationStartDate: null,
      joined: new Date().toDateString(),
      profilePic: 'pic2'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageUsersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageUsersComponent);
    component = fixture.componentInstance;

    // Override the initial value for testing
    component.$snippets.set(userDetails);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initially have no checked users', () => {
    expect(component.$checkedUsers()).toEqual([]);
  });

  it('should add user to checked list on checkbox click', () => {
    component.handleUserCheckboxClicked('1');
    expect(component.$checkedUsers()).toEqual(['1']);
  });

  it('should remove user from checked list on second click', () => {
    component.handleUserCheckboxClicked('1');
    component.handleUserCheckboxClicked('1');
    expect(component.$checkedUsers()).toEqual([]);
  });

  it('should select all users on check-all click when none selected', () => {
    component.handleCheckAllClicked();
    expect(component.$checkedUsers()).toEqual(['1', '2']);
  });

  it('should deselect all users on check-all click when some are already selected', () => {
    component.$checkedUsers.set(['1']);
    component.handleCheckAllClicked();
    expect(component.$checkedUsers()).toEqual([]);
  });

  it('should set selectedUser when user snippet is clicked', () => {
    const user = userDetails[0];
    component.selectedUser = user;
    expect(component.selectedUser).toEqual(user);
  });
});
