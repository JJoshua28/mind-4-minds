import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMentorDetailsPageComponent } from './edit-mentor-details-page.component';

describe('EditMentorComponent', () => {
  let component: EditMentorDetailsPageComponent;
  let fixture: ComponentFixture<EditMentorDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMentorDetailsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMentorDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
