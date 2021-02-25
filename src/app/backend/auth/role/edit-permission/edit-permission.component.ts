import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IPermission } from '../../../../theme/models/auth';
import { RoleService } from '../role.service';

@Component({
  selector: 'app-edit-permission',
  templateUrl: './edit-permission.component.html',
  styleUrls: ['./edit-permission.component.scss']
})
export class EditPermissionComponent implements OnInit {

  public form = this.fb.group({
    name: ['', Validators.required],
    display_name: ['', Validators.required],
    description: ['']
  });

  public data: IPermission;

  constructor(
    private fb: FormBuilder,
    private service: RoleService,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (!params.id) {
        return;
      }
      this.service.permission(params.id).subscribe(res => {
        this.data = res;
        this.form.patchValue({
          name: res.name,
          display_name: res.display_name,
          description: res.description
        });
      });
    });
  }

  get name() {
    return this.form.get('name');
  }

  get displayName() {
    return this.form.get('display_name');
  }

  public tapBack() {
    history.back();
  }

  public tapSubmit() {
    if (this.form.invalid) {
      this.toastrService.warning('表单填写不完整');
      return;
    }
    const data: IPermission = Object.assign({}, this.form.value);
    if (this.data && this.data.id > 0) {
      data.id = this.data.id;
    }
    this.service.permissionSave(data).subscribe(_ => {
      this.toastrService.success('保存成功');
      this.tapBack();
    });
  }

}
