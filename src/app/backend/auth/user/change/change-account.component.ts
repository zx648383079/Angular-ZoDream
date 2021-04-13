import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IUser } from '../../../../theme/models/user';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-change-account',
  templateUrl: './change-account.component.html',
  styleUrls: ['./change-account.component.scss']
})
export class ChangeAccountComponent implements OnInit {

    public form = this.fb.group({
        type: [0, Validators.required],
        money: [0, Validators.required],
        remark: [''],
    });

    public data: IUser;

    constructor(private fb: FormBuilder,
        private service: AuthService,
        private route: ActivatedRoute,
        private toastrService: ToastrService) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                this.tapBack();
                return;
            }
            this.service.userAccount(params.id).subscribe(res => {
                this.data = res;
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: any = Object.assign({}, this.form.value);
        if (this.data && this.data.id > 0) {
            data.user_id = this.data.id;
        }
        this.service.rechargeSave(data).subscribe(_ => {
            this.toastrService.success('充值成功');
            this.tapBack();
        });
    }
}
