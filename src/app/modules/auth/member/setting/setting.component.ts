import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { SearchService } from '../../../../theme/services';
import { MemberService } from '../member.service';


interface IGroupHeader {
    id: number;
    icon: string;
    name: string;
    meta: string;
}

@Component({
    selector: 'app-member-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

    public data: any = {
        accept_new_bulletin: true,
        open_not_disturb: false,
        post_expiration: 0,
    };
    public isChanged = false;

    public tabItems: IGroupHeader[] = [
        {
            id: 3,
            icon: 'user',
            name: $localize `Account Information`,
            meta: $localize `Edit user information, change password, authorization management, account association, login device management`,
        },
        {
            id: 2,
            icon: 'shield',
            name: $localize `Security and privacy`,
            meta: $localize `Dynamic timing, upload watermark`,
        },
        {
            id: 1,
            icon: 'commenting',
            name: $localize `Message Notification`,
            meta: $localize `New message notification, Do Not Disturb mode`,
        },
    ];

    public crumbs: IGroupHeader[] = [
    ];

    constructor(
        private service: MemberService,
        private toastrService: DialogService,
        private searchService: SearchService,
    ) { }

    ngOnInit() {
        this.service.settings().subscribe(res => {
            this.data = this.searchService.getQueries(res, this.data);
            this.isChanged = false;
        });
    }

    public get tabIndex() {
        return this.crumbs.length < 1 ? 0 : this.crumbs[this.crumbs.length - 1].id;
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
            this.toastrService.warning($localize `Form filling unchanged`);
            return;
        }
        e?.enter();
        const data: any = Object.assign({}, this.data);
        this.service.settingsSave(data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Save successfully`);
                this.isChanged = false;
            }, error: err => {
                e?.reset();
                this.toastrService.warning(err.error.message);
            }
        });
    }

}
