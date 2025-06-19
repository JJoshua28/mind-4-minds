import {FormArray, FormControl } from "@angular/forms";

export interface MentorDetailsFormControl {
  description: FormControl<string>;
  qualifications: FormControl<string>;
  experience: FormControl<string>;
  commitment: FormControl<string>;
  meetingPreferences: FormArray<FormControl<boolean>>;
  neurodivergentConditions: FormArray<FormControl<boolean>>;
}
