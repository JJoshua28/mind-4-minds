import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterUserDetailsPageComponent } from './register-user-details-page.component';

describe('RegisterUserDetailsPageComponent', () => {
  let component: RegisterUserDetailsPageComponent;
  let fixture: ComponentFixture<RegisterUserDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterUserDetailsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterUserDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
