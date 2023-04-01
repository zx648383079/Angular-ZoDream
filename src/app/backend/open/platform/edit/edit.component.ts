import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { IPlatform } from '../../../../theme/models/open';
import { IItem } from '../../../../theme/models/seo';
import { OpenService } from '../../open.service';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        type: [0],
        domain: [''],
        description: [''],
        sign_type: [0],
        sign_key: [''],
        encrypt_type: [0],
        public_key: [''],
        rules: [''],
        allow_self: ['0'],
        status: [0],
    });

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

    constructor(
        private fb: FormBuilder,
        private service: OpenService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
      ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.reviewable = window.location.href.indexOf('review') > 0;
            if (!params.id) {
                return;
            }
            const cb = this.reviewable ? this.service.review : this.service.platform;
            cb.call(this.service, params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
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

    get name() {
        return this.form.get('name');
    }

    get signType() {
        return this.form.get('sign_type').value;
    }

    get encryptType() {
        return this.form.get('encrypt_type').value;
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: IPlatform = Object.assign({}, this.form.value) as any;
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
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
