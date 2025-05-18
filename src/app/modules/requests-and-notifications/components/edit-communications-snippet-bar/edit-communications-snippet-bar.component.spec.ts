import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCommunicationsSnippetBarComponent } from './edit-communications-snippet-bar.component';

describe('EditCommunicationsSnippetBarComponent', () => {
  let component: EditCommunicationsSnippetBarComponent;
  let fixture: ComponentFixture<EditCommunicationsSnippetBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCommunicationsSnippetBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCommunicationsSnippetBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
