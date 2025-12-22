import { Component, OnInit } from '@angular/core';

interface IGroupHeader {
    id: number;
    icon: string;
    name: string;
    meta: string;
}

@Component({
    standalone: false,
    selector: 'app-example-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.scss']
})
export class ExampleSettingComponent {

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
            meta: '动态时效、上传水印',
        }
    ];

    public crumbs: IGroupHeader[] = [
    ];

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
}
