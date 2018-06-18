import { forwardRef, Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface IOption {
  name: string;
  value: string;
}

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {
  @Input() public options: IOption[];

  public selectedValue: string;
  public isDisabled: boolean;

  private propagateChange = _ => {};

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  writeValue(obj) {
    if (obj) {
      this.selectedValue = obj;
    }
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }

  onChange(event) {
    this.propagateChange(event.target.value);
  }

  registerOnTouched(fn) {}
}
