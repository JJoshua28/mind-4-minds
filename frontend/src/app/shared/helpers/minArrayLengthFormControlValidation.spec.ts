import { FormArray, FormControl } from '@angular/forms';
import {minLengthArray} from "./minArrayLengthFormControlValidation";

describe('minLengthArray Validator', () => {
  it('should return null if array length is equal to minimum', () => {
    const control = new FormArray([
      new FormControl('Goal 1'),
    ]);

    const result = minLengthArray(1)(control);

    expect(result).toBeNull();
  });

  it('should return null if array length is greater than minimum', () => {
    const control = new FormArray([
      new FormControl('Goal 1'),
      new FormControl('Goal 2'),
    ]);

    const result = minLengthArray(1)(control);

    expect(result).toBeNull();
  });

  it('should return error if array length is less than minimum', () => {
    const control = new FormArray([]);

    const result = minLengthArray(1)(control);

    expect(result).toEqual({
      minLengthArray: {
        requiredLength: 1,
        actualLength: 0
      }
    });
  });

  it('should return error if control is not an array (defensive check)', () => {
    const control: any = new FormControl(null);

    const result = minLengthArray(1)(control);

    expect(result).toEqual({
      minLengthArray: {
        requiredLength: 1,
        actualLength: 0
      }
    });
  });
});
