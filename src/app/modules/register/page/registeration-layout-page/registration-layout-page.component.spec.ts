import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationLayoutPageComponent } from './registration-layout-page.component';

describe('RegisterationLayoutPageComponent', () => {
  let component: RegistrationLayoutPageComponent;
  let fixture: ComponentFixture<RegistrationLayoutPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationLayoutPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationLayoutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
