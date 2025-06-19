import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsAndNotificationBarComponent } from './requests-and-notification-bar.component';

describe('RequestsAndNotificationBarComponent', () => {
  let component: RequestsAndNotificationBarComponent;
  let fixture: ComponentFixture<RequestsAndNotificationBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestsAndNotificationBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestsAndNotificationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
