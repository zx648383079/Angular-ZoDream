import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { confirmValidator } from '../../theme/validators';
import { IErrorResponse } from '../../theme/models/page';
import { AuthService, ThemeService } from '../../theme/services';
import { DialogService } from '../../dialog';

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
        private fb: FormBuilder,
        private service: AuthService,
        private toastrService: DialogService,
        private router: Router,
        private route: ActivatedRoute,
        private themeService: ThemeService,
    ) {
        this.themeService.setTitle('找回密码');
    }

    ngOnInit() {}

    get btnLabel() {
        return this.sended ? '重置密码' : '发送验证邮件';
    }

    public tapSubmit() {
        if (!this.sended) {
            this.service.sendFindEmail(this.findForm.get('email').value).subscribe({
                next: res => {
                    this.toastrService.success(res.message);
                    this.sended = true;
                }, error: err => {
                    const res = err.error as IErrorResponse;
                    this.toastrService.warning(res.message);
                }
            });
            return;
        }
        const data = Object.assign({}, this.findForm.value);
        if (!data.code) {
            this.toastrService.warning('请输入安全代码');
            return;
        }
        if (!data.password) {
            this.toastrService.warning('请输入新密码');
            return;
        }
        this.service.resetPassword(data).subscribe({
            next: _ => {
                this.toastrService.success('成功找回密码');
                this.router.navigate(['../'], {relativeTo: this.route});
            }, error: err => {
                const res = err.error as IErrorResponse;
                this.toastrService.warning(res.message);
            }
        });
    }
}
