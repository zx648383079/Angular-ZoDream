import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IRole } from '../../../theme/models/auth';
import { IUser } from '../../../theme/models/user';
import { confirmValidator } from '../../../theme/validators';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  public form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    sex: ['0'],
    birthday: [''],
    roles: [[]],
    password: [''],
    confirm_password: [''],
  }, {
    validators: confirmValidator()
  });

  public data: IUser;

  public roleItems: IRole[] = [];

  constructor(
    private fb: FormBuilder,
    private service: AccountService,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
  ) {}

  ngOnInit() {
    this.service.roleAll().subscribe(res => {
      this.roleItems = res.data;
    });
    this.route.params.subscribe(params => {
      if (!params.id) {
        return;
      }
      this.service.user(params.id).subscribe(res => {
        this.data = res;
        this.form.setValue({
          name: res.name,
          sex: res.sex,
          email: res.email,
          birthday: res.birthday,
          roles: res.roles,
          password: '',
          confirm_password: '',
        });
      });
    });
  }

  get name() {
    return this.form.get('name');
  }

  get email() {
    return this.form.get('email');
  }

  public tapBack() {
    history.back();
  }

  public tapSubmit() {
    if (this.form.invalid) {
      this.toastrService.warning('表单填写不完整');
      return;
    }
    const data: any = this.form.value;
    if (this.data && this.data.id > 0) {
      data.id = this.data.id;
    }
    this.service.userSave(data).subscribe(_ => {
      this.toastrService.success('保存成功');
      this.tapBack();
    });
  }

}
