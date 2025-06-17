import {FormArray, FormControl} from "@angular/forms";

export interface MenteeDetailsFormControls {
  description: FormControl<string>;
  goals: FormArray<FormControl<string>>;
  learningPreferences: FormArray<FormControl<boolean>>;
  expectations: FormControl<string | null>;
  neurodivergentConditions: FormArray<FormControl<boolean>>;
  meetingPreferences: FormArray<FormControl<boolean>>;
  commitment: FormControl<string>;
}
