import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMentorsPageComponent } from './my-mentors-page.component';

describe('MyMentorsPageComponent', () => {
  let component: MyMentorsPageComponent;
  let fixture: ComponentFixture<MyMentorsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyMentorsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyMentorsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
