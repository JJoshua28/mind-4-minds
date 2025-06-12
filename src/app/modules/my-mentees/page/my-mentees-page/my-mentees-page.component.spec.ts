import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMenteesPageComponent } from './my-mentees-page.component';

describe('MyMenteesPageComponent', () => {
  let component: MyMenteesPageComponent;
  let fixture: ComponentFixture<MyMenteesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyMenteesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyMenteesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
