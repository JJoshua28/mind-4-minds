import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMentorModalComponent } from './view-mentor-modal.component';

describe('ViewUserModalComponent', () => {
  let component: ViewMentorModalComponent;
  let fixture: ComponentFixture<ViewMentorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMentorModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMentorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
