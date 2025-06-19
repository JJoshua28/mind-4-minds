import {Component, forwardRef, input, signal, WritableSignal} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-textarea-input',
  standalone: true,
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextAreaInputComponent),
      multi: true,
    },
  ],
  templateUrl: './text-area-input.component.html',
  styleUrl: './text-area-input.component.scss'
})
export class TextAreaInputComponent implements ControlValueAccessor {
  label = input.required<string>();

  value: WritableSignal<string> = signal("");

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
