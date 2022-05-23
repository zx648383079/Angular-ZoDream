import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogService } from '../../../components/dialog';
import { ButtonEvent } from '../../../components/form';
import { getQueries } from '../../../theme/query';
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

    public data: any = {
        accept_new_bulletin: true,
        open_not_disturb: false,
        post_expiration: 0,
    };
    public isChanged = false;

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
        this.service.settings().subscribe(res => {
            this.data = getQueries(res, this.data);
            this.isChanged = false;
        });
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

    public onValueChange() {
        this.isChanged = true;
    }

    public tapSubmit(e?: ButtonEvent) {
        if (!this.isChanged) {
            this.toastrService.warning('表单填写未改变');
            return;
        }
        e?.enter();
        const data: any = Object.assign({}, this.data);
        this.service.settingsSave(data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success('保存成功');
                this.isChanged = false;
            }, error: err => {
                e?.reset();
                this.toastrService.warning(err.error.message);
            }
        });
    }

}
