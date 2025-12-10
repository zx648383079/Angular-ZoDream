import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IErrorResult } from '../../../../../theme/models/page';
import { IBotAccount } from '../../../model';
import { BotService } from '../../bot.service';
import { ButtonEvent } from '../../../../../components/form';

@Component({
    standalone: false,
  selector: 'app-bot-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss']
})
export class EditAccountComponent implements OnInit {
    private fb = inject(FormBuilder);
    private service = inject(BotService);
    private route = inject(ActivatedRoute);
    private toastrService = inject(DialogService);


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

    public data: IBotAccount;
    public typeItems = ['订阅号', '认证订阅号', '企业号', '认证服务号'];

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

    public tapSubmit(e?: ButtonEvent) {
        if (this.form.invalid) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: any = Object.assign({}, this.form.value);
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        e?.enter();
        this.service.accountSave(data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Save Successfully`);
                this.tapBack();
            },
            error: (err: IErrorResult) => {
                e?.reset();
                this.toastrService.warning(err.error.message);
            }
        });
    }

}
