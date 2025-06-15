import { ComponentFixture, TestBed } from '@angular/core/testing';

import {ActionTypes, ConfirmActionModalComponent} from './confirm-action-modal.component';
import {ComponentRef, signal} from "@angular/core";

describe('ConfirmActionModalComponent', () => {
  let component: ConfirmActionModalComponent;
  let componentRef: ComponentRef<ConfirmActionModalComponent>;
  let fixture: ComponentFixture<ConfirmActionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmActionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmActionModalComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
1
    componentRef.setInput('$type', ActionTypes.CONFIRM);
    componentRef.setInput('$messageTopic', 'testing');

    component.isHidden = signal(true)


    await fixture.whenStable();

    fixture.detectChanges();
  });

  beforeAll(() => {
    HTMLDialogElement.prototype.show = jest.fn();
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
  });


  it('should be hidden by default', () => {
    const componentContainer = fixture.nativeElement.querySelector('div');
    expect(componentContainer.classList).toContain("isHidden");

  });
  describe('When the modal is shown', () => {
    beforeEach(async () => {
      component.show()
      component.isHidden = signal(false)
      component.modal = fixture.nativeElement.querySelector('dialog')

      await fixture.whenStable();
      fixture.detectChanges();
    })
    it('should be not be hidden', () => {
      const componentContainer = fixture.nativeElement.querySelector('div');
      expect(componentContainer.classList).not.toContain("isHidden");
    });
  });
});
