import {Component, forwardRef, input, signal, WritableSignal} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-date-input',
  standalone: true,
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true,
    },
  ],
  templateUrl: './date-input.component.html',
  styleUrl: './date-input.component.scss'
})
export class DateInputComponent implements ControlValueAccessor {
  $label = input.required<string>();
  $initialInput = input<string>("");

  value: WritableSignal<string> = signal<string>(this.$initialInput());

  private onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // optional: handle disabled state
  }

  onInput(value: string) {
    this.value.set(value);
    this.onChange(value);
  }

  protected readonly HTMLInputElement = HTMLInputElement;
}
