import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationsSnippetComponent } from './communications-snippet.component';

describe('MessageSnippetComponent', () => {
  let component: CommunicationsSnippetComponent;
  let fixture: ComponentFixture<CommunicationsSnippetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunicationsSnippetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunicationsSnippetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
