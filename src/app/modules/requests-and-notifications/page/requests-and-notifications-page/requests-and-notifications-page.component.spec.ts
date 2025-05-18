import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsAndNotificationsPageComponent } from './requests-and-notifications-page.component';

describe('RequestsAndNotificationsPageComponent', () => {
  let component: RequestsAndNotificationsPageComponent;
  let fixture: ComponentFixture<RequestsAndNotificationsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestsAndNotificationsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestsAndNotificationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
