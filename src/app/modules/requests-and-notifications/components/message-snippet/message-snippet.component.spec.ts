import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageSnippetComponent } from './message-snippet.component';

describe('MessageSnippetComponent', () => {
  let component: MessageSnippetComponent;
  let fixture: ComponentFixture<MessageSnippetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageSnippetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageSnippetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
