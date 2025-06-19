import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function minLengthArray(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const arr = control as any;
    if (arr?.length >= min) {
      return null;
    }
    return { minLengthArray: { requiredLength: min, actualLength: arr?.length || 0 } };
  };
}
