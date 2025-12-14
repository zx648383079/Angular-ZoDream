import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { IPlatform } from '../../../../theme/models/open';
import { IItem } from '../../../../theme/models/seo';
import { OpenService } from '../../open.service';
import { form, required } from '@angular/forms/signals';
import { parseNumber } from '../../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
    private readonly service = inject(OpenService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly dataModel = signal({
        id: 0,
        name: '',
        type: '0',
        domain: '',
        description: '',
        sign_type: '0',
        sign_key: '',
        encrypt_type: '0',
        public_key: '',
        rules: '',
        allow_self: false,
        status: '0',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });

    public readonly signType = computed(() => parseNumber(this.dataForm.sign_type().value()));
    public readonly encryptType = computed(() => parseNumber(this.dataForm.encrypt_type().value()));

    public data: IPlatform;
    public typeItems = [
        '网站',
        'APP',
        '小程序',
        '游戏',
        '其他',
    ];

    public signItems = [
        '不签名',
        'MD5',
        'HMAC',
    ];
    public encryptItems = [
        '不加密',
        'RSA',
        'RSA2',
        'DES'
    ];

    public statusItems: IItem[] = [
        {
            name: '无',
            value: 0,
        },
        {
            name: '正常',
            value: 1,
        },
        {
            name: '审核中',
            value: 9,
        },
    ];
    public reviewable = false;

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.reviewable = window.location.href.indexOf('review') > 0;
            if (!params.id) {
                return;
            }
            const cb = this.reviewable ? this.service.review : this.service.platform;
            cb.call(this.service, params.id).subscribe(res => {
                this.data = res;
                this.dataModel.set({
                    id: res.id,
                    name: res.name,
                    type: res.type,
                    domain: res.domain,
                    description: res.description,
                    sign_type: res.sign_type,
                    sign_key: res.sign_key,
                    encrypt_type: res.encrypt_type,
                    public_key: res.public_key,
                    rules: res.rules,
                    allow_self: res.allow_self.toString(),
                    status: res.status,
                });
          });
        });
    }



    public tapBack() {
        history.back();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: IPlatform = this.dataForm().value() as any;
        e?.enter();
        const cb = this.reviewable ? this.service.reviewSave : this.service.platformSave;
        cb.call(this.service, data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Save Successfully`);
                this.tapBack();
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }

}
