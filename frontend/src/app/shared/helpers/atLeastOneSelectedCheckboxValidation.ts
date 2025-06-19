import { AbstractControl, ValidationErrors, FormArray } from '@angular/forms';

export function atLeastOneTrueValidator(control: AbstractControl): ValidationErrors | null {
  const formArray = control as FormArray;
  const hasAtLeastOneTrue = formArray.controls.some(ctrl => ctrl.value === true);
  return hasAtLeastOneTrue ? null : { atLeastOneRequired: true };
}
