import {MentorService} from './mentor.service';
import {of, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AuthServiceService} from '../auth-service.service';
import {LocalStorageService} from '../local-storage.service';
import {HttpService} from '../http.service';
import {UserService} from './user-service.service';
import {UserType} from '../../../types/user-type.enum';
import {MentorDetailsApi} from '../../../types/api/mentor-details.interface';
import {TestBed} from "@angular/core/testing";

describe('MentorService', () => {
  let service: MentorService;

  const mockRouter = {
    navigate: jest.fn(),
    url: '/profile'
  };

  const mockAuthService = {
    getAccessToken: jest.fn().mockReturnValue('fake-token')
  };

  const mockLocalStorageService = {
    getItem: jest.fn().mockReturnValue('123')
  };

  const mockHttpService = {
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  };

  const mockUserService = {
    userId: '123',
    userDetails: jest.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MentorService,
        { provide: Router, useValue: mockRouter },
        { provide: AuthServiceService, useValue: mockAuthService },
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: HttpService, useValue: mockHttpService },
        { provide: UserService, useValue: mockUserService },
      ]
    });

    service = TestBed.inject(MentorService);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ngOnInit', () => {
    it('should redirect if no auth token and not on login/edit route', () => {
      mockAuthService.getAccessToken.mockReturnValue(null);
      mockLocalStorageService.getItem.mockReturnValue(null);
      mockRouter.url = '/profile';

      service.ngOnInit();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile']);
    });
  });

  describe('mentorUser', () => {
    it('should return a MentorUser when user has MENTOR role', (done) => {
      const mockUser = {
        id: '1',
        roles: [UserType.MENTOR],
      };

      const mockMentorDetails = [{
        id: '1',
        description: 'A mentor',
        qualifications: '',
        experience: '',
        commitment: '',
        meeting_preferences: [],
        neurodivergent_conditions: []
      }] as MentorDetailsApi[];

      mockUserService.userDetails.mockReturnValue(of(mockUser));
      mockHttpService.get.mockReturnValue(of(mockMentorDetails));

      service.mentorUser().subscribe((mentorUser) => {
        expect(mentorUser.mentorDetails.description).toBe('A mentor');
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        done();
      });
    });

    it('should redirect if user is not a mentor', (done) => {
      mockUserService.userDetails.mockReturnValue(of({roles: []}));

      service.mentorUser().subscribe({
        complete: () => {
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile']);
          done();
        }
      });
    });
  });

  describe('updateMentorDetails', () => {
    it('should call PUT and return updated mentor details', (done) => {
      const mockMentorDetails = [{
        id: '1',
        description: 'Old',
        qualifications: '',
        experience: '',
        commitment: '',
        meeting_preferences: [],
        neurodivergent_conditions: []
      }] as MentorDetailsApi[];

      mockHttpService.put.mockReturnValue(of({...mockMentorDetails[0], description: 'New'}));
      mockUserService.userDetails.mockReturnValue(of({id: '1'}));
      mockHttpService.get.mockReturnValue(of(mockMentorDetails));

      service.updateMentorDetails({description: 'New'}).subscribe((result) => {
        expect(result.description).toBe('New');
        done();
      });
    });
  });

  describe('deleteMenteeDetails', () => {
    it('should call DELETE API with correct ID', (done) => {
      mockHttpService.delete.mockReturnValue(of({}));

      service.deleteMenteeDetails('456').subscribe(() => {
        expect(mockHttpService.delete).toHaveBeenCalledWith('users/mentor-details/456/');
        done();
      });
    });
  });
});
