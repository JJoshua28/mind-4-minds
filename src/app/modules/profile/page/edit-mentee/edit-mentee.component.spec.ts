import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMenteeComponent } from './edit-mentee.component';

describe('EditMenteeComponent', () => {
  let component: EditMenteeComponent;
  let fixture: ComponentFixture<EditMenteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMenteeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMenteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
