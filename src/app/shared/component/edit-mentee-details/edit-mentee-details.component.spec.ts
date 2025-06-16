import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditMenteeDetailsComponent } from './edit-mentee-details.component';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenteeDetailsFormControls } from '../../../types/user details/mentee-details.interface';
import { signal } from '@angular/core';

describe('EditMenteeDetailsComponent', () => {
  let component: EditMenteeDetailsComponent;
  let fixture: ComponentFixture<EditMenteeDetailsComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMenteeDetailsComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(EditMenteeDetailsComponent);
    component = fixture.componentInstance;
    const componentRef = fixture.componentRef;
    formBuilder = TestBed.inject(FormBuilder);

    const testForm = formBuilder.group<MenteeDetailsFormControls>({
      description: formBuilder.nonNullable.control('Test description', Validators.required),
      goals: formBuilder.nonNullable.array([] as string[]),
      learningPreferences: formBuilder.nonNullable.array([] as boolean[]),
      expectations: formBuilder.nonNullable.control(''),
      neurodivergentConditions: formBuilder.nonNullable.array([] as boolean[]),
      meetingPreferences: formBuilder.nonNullable.array([] as boolean[]),
      commitment: formBuilder.nonNullable.control('Some commitment', Validators.required),
    });

    componentRef.setInput("$menteeDetailsForm", signal(testForm));

    await fixture.whenStable();

    fixture.detectChanges();
  });

  it('should add a new goal to the form', () => {
    // Simulate user entering a goal
    component.newGoalControl.setValue('Become a better developer');
    component.addGoal();

    const goals = component.$menteeDetailsForm().controls.goals as FormArray<FormControl<string>>;
    expect(goals.length).toBe(1);
    expect(goals.at(0).value).toBe('Become a better developer');
  });

  it('should trim input and not add empty or whitespace-only goals', () => {
    component.newGoalControl.setValue('    ');
    component.addGoal();

    const goals = component.$menteeDetailsForm().controls.goals as FormArray<FormControl<string>>;
    expect(goals.length).toBe(0);
  });

  it('should remove a goal by index', () => {
    const formArray = component.$menteeDetailsForm().controls.goals as FormArray<FormControl<string>>;
    formArray.push(formBuilder.nonNullable.control('Goal 1'));
    formArray.push(formBuilder.nonNullable.control('Goal 2'));

    component.removeGoal(0);

    expect(formArray.length).toBe(1);
    expect(formArray.at(0).value).toBe('Goal 2');
  });
});
