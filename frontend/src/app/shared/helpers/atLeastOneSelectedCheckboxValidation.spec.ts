import { FormBuilder, FormControl } from '@angular/forms';

import {atLeastOneTrueValidator} from "./atLeastOneSelectedCheckboxValidation";

describe('atLeastOneTrueValidator', () => {
  let formBuilder: FormBuilder;

  beforeEach(() => {
    formBuilder = new FormBuilder();
  });

  it('should return error when all checkboxes are false', () => {
    const array = formBuilder.array([
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
    ], { validators: [atLeastOneTrueValidator] });

    expect(array.valid).toBeFalsy();
    expect(array.errors).toEqual({ atLeastOneRequired: true });
  });

  it('should be valid when at least one checkbox is true', () => {
    const array = formBuilder.array([
      new FormControl(false),
      new FormControl(true),
      new FormControl(false),
    ], { validators: [atLeastOneTrueValidator] });

    expect(array.valid).toBeTruthy();
    expect(array.errors).toBeNull();
  });

  it('should be valid when all checkboxes are true', () => {
    const array = formBuilder.array([
      new FormControl(true),
      new FormControl(true),
      new FormControl(true),
    ], { validators: [atLeastOneTrueValidator] });

    expect(array.valid).toBeTruthy();
    expect(array.errors).toBeNull();
  });
});
