import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IErrorResult } from '../../../../../theme/models/page';
import { IWeChatAccount } from '../../../model';
import { WechatService } from '../../wechat.service';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss']
})
export class EditAccountComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        token: ['', Validators.required],
        account: ['', Validators.required],
        original: ['', Validators.required],
        type: [0],
        appid: ['', Validators.required],
        secret: ['', Validators.required],
        aes_key: [''],
        avatar: [''],
        qrcode: [''],
        address: [''],
        description: [''],
        username: [''],
        password: [''],
    });

    public data: IWeChatAccount;
    public typeItems = ['订阅号', '认证订阅号', '企业号', '认证服务号'];

    constructor(
        private fb: FormBuilder,
        private service: WechatService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
              return;
            }
            this.service.account(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
                    name: res.name,
                    token: res.token,
                    account: res.account,
                    original: res.original,
                    type: res.type,
                    appid: res.appid,
                    secret: res.secret,
                    aes_key: res.aes_key,
                    avatar: res.avatar,
                    qrcode: res.qrcode,
                    address: res.address,
                    description: res.description,
                    username: res.username,
                    password: res.password,
                });
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
            data.id = this.data.id;
        }
        this.service.accountSave(data).subscribe({
            next: _ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapBack();
            },
            error: (err: IErrorResult) => {
                this.toastrService.warning(err.error.message);
            }
        });
    }

}
