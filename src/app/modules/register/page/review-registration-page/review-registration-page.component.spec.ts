import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewRegistrationPageComponent } from './review-registration-page.component';

describe('ReviewRegistrationPageComponent', () => {
  let component: ReviewRegistrationPageComponent;
  let fixture: ComponentFixture<ReviewRegistrationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewRegistrationPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewRegistrationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
