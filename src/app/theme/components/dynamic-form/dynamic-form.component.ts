import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { InputBase } from './input-base';
import { FormControlService } from './form-control.service';

@Component({
  selector: 'zd-form',
  templateUrl: './dynamic-form.component.html',
  providers: [FormControlService],
})
export class DynamicFormComponent implements OnInit {

  @Input() questions: InputBase<any>[] = [];
  form: FormGroup;
  payLoad = '';

  constructor(private qcs: FormControlService) {  }

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions);
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);
  }
}
