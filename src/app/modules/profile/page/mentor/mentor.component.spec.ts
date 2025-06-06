import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorComponent } from './mentor.component';

describe('MentorComponent', () => {
  let component: MentorComponent;
  let fixture: ComponentFixture<MentorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
