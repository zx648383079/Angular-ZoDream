import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InputBase } from './input-base';

@Component({
  selector: 'zd-input',
  templateUrl: './dynamic-input.component.html',
})
export class DynamicInputComponent {
  @Input() question: InputBase<any>;
  @Input() form: FormGroup;
  get isValid() { return this.form.controls[this.question.key].valid; }
}
