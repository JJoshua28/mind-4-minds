import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenteeDetailsPageComponent } from './mentee-details-page.component';

describe('MenteeDetailsComponent', () => {
  let component: MenteeDetailsPageComponent;
  let fixture: ComponentFixture<MenteeDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenteeDetailsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenteeDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
