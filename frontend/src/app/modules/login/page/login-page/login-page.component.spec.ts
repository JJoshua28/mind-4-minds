import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPageComponent } from './login-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { HttpService } from '../../../../shared/services/http.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { AuthServiceService } from '../../../../shared/services/auth-service.service';
import { UserService } from '../../../../shared/services/user/user-service.service';
import { UserType } from '../../../../types/user-type.enum';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  const mockRouter = { navigate: jest.fn() };
  const mockHttpService = {
    post: jest.fn(),
  };
  const mockAuthService = {
    setAccessToken: jest.fn(),
    setRefreshToken: jest.fn(),
  };
  const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn(),
  };
  const mockUserService = {
    initialiseData: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPageComponent, ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: HttpService, useValue: mockHttpService },
        { provide: AuthServiceService, useValue: mockAuthService },
        { provide: LocalStorageService, useValue: mockLocalStorage },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should clear storage on init if tokens exist', () => {
    mockLocalStorage.getItem.mockReturnValueOnce('token');
    component.ngOnInit();
    expect(mockLocalStorage.clear).toHaveBeenCalled();
  });

  it('should not submit if form is invalid', () => {
    component.loginCredentials.setValue({ email: '', password: '' });
    component.onSubmit();
    expect(mockHttpService.post).not.toHaveBeenCalled();
  });

  it('should authenticate and navigate to mentor page on login', () => {
    component.loginCredentials.setValue({ email: 'test@example.com', password: 'password' });

    const mockToken = { access: 'token1', refresh: 'token2', user_id: 'user1' };
    const mockUserAccount = {
      id: 'user1',
      email: 'test@example.com',
      is_active: true,
      details: 'detail1',
      joined: '2024-01-01',
    };
    const mockUserDetails = {
      id: 'detail1',
      first_name: 'Test',
      last_name: 'User',
      occupation: 'Engineer',
      occupation_start_date: '2023-01-01',
      profilePic: 'pic.jpg',
      roles: [UserType.MENTOR],
      user_account: mockUserAccount,
    };

    mockHttpService.post.mockReturnValue(of(mockToken));
    mockUserService.initialiseData.mockReturnValue(of(mockUserDetails));

    component.onSubmit();

    expect(mockAuthService.setAccessToken).toHaveBeenCalledWith('token1');
    expect(mockAuthService.setRefreshToken).toHaveBeenCalledWith('token2');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('user_id', 'user1');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/my-mentees']);
  });
});
