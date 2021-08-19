import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogService } from '../../../dialog';
import { ButtonEvent } from '../../../form';
import { UserService } from '../user.service';

interface IGroupHeader {
    id: number;
    icon: string;
    name: string;
    meta: string;
}

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss']
})
export class UserSettingComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
    });

    public tabItems: IGroupHeader[] = [
        {
            id: 1,
            icon: 'commenting',
            name: '消息通知',
            meta: '新消息通知、勿扰模式',
        },
        {
            id: 2,
            icon: 'shield',
            name: '隐私',
            meta: '动态时效',
        }
    ];

    public crumbs: IGroupHeader[] = [
    ];

    constructor(
        private fb: FormBuilder,
        private service: UserService,
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
    }

    public get tabIndex() {
        return this.crumbs.length < 1 ? 0 : this.crumbs[this.crumbs.length - 1].id;
    }

    public get crumbTitle() {
        return ['个性化', ...this.crumbs.map(i => i.name)].join(' / ');
    }

    public tapTab(item: IGroupHeader) {
        for (let index = 0; index < this.crumbs.length; index++) {
            const element = this.crumbs[index];
            if (element.id === item.id) {
                this.crumbs.splice(index + 1);
                return;
            }
        }
        this.crumbs.push(item);
    }

    public tapBack() {
        this.crumbs.pop();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        e?.enter();
        const data: any = Object.assign({}, this.form.value);
        this.service.uploadProfile(data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success('保存成功');
            }, error: err => {
                e?.reset();
                this.toastrService.warning(err.error.message);
            }
        });
    }

}
