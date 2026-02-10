import { Component, OnInit, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IErrorResult } from '../../../../../theme/models/page';
import { IBotAccount, PlatformTypeItems } from '../../../model';
import { BotService } from '../../bot.service';
import { ButtonEvent } from '../../../../../components/form';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-bot-m-edit-account',
    templateUrl: './edit-account.component.html',
    styleUrls: ['./edit-account.component.scss']
})
export class EditAccountComponent implements OnInit {
    private readonly service = inject(BotService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly location = inject(Location);

    public readonly dataModel = signal({
        id: 0,
        name: '',
        platform_type: '',
        token: '',
        account: '',
        original: '',
        type: '',
        appid: '',
        secret: '',
        aes_key: '',
        avatar: '',
        qrcode: '',
        address: '',
        description: '',
        username: '',
        password: '',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
        required(schemaPath.token);
    });

    public typeItems = ['订阅号', '认证订阅号', '企业号', '认证服务号'];    public platformItems = PlatformTypeItems;

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
              return;
            }
            this.service.account(params.id).subscribe(res => {
                this.dataModel.set({
                    id: res.id,
                    name: res.name,
                    platform_type: res.platform_type as any,
                    token: res.token,
                    account: res.account,
                    original: res.original,
                    type: res.type as any,
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
        this.location.back();
    }

    public tapSubmit2(e: SubmitEvent) {
        e.preventDefault();
        this.tapSubmit();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: any = this.dataForm().value();
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
