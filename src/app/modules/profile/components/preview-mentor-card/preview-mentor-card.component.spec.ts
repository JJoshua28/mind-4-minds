import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewMentorCardComponent } from './preview-mentor-card.component';

describe('PreviewMentorCardComponent', () => {
  let component: PreviewMentorCardComponent;
  let fixture: ComponentFixture<PreviewMentorCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewMentorCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewMentorCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
