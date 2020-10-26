import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { confirmValidator } from '../../../theme/validators';
import { UserService } from '../user.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent {

  public form = this.fb.group({
    old_password: ['', Validators.required],
    password: ['', Validators.required],
    confirm_password: ['', Validators.required],
  }, {
    validators: confirmValidator()
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private service: UserService,
    private toastrService: ToastrService) { }

  public tapBack() {
    history.back();
  }

  public tapSubmit() {
    if (this.form.invalid) {
      this.toastrService.warning('表单填写不完整');
      return;
    }
    const data: any = Object.assign({}, this.form.value);
    this.service.passwordUpdate(data).subscribe(_ => {
      this.toastrService.success('密码修改成功');
      this.tapBack();
    });
  }

}
