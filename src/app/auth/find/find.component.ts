import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { confirmValidator } from 'src/app/theme/validators';

@Component({
  selector: 'app-find',
  templateUrl: './find.component.html',
  styleUrls: ['./find.component.scss']
})
export class FindComponent implements OnInit {

  public sended = false;
  public isObserve = false;

  public findForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    code: [''],
    password: [''],
    confirm_password: ['']
  }, {
    validators: confirmValidator()
  });

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
  }

  get btnLabel() {
    return this.sended ? '重置密码' : '发送验证邮件';
  }

  public tapSubmit() {
    this.sended = true;
  }

}
