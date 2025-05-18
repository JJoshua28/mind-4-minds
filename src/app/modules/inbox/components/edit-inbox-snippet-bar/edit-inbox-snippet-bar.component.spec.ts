import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInboxSnippetBarComponent } from './edit-inbox-snippet-bar.component';

describe('EditCommunicationsSnippetBarComponent', () => {
  let component: EditInboxSnippetBarComponent;
  let fixture: ComponentFixture<EditInboxSnippetBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditInboxSnippetBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInboxSnippetBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
