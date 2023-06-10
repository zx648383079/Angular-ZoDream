import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IData } from '../../../../theme/models/page';
import { IShopPlugin } from '../../model';
import { DialogService } from '../../../../components/dialog';

interface IPluginItem {
    icon: string;
    code: string;
    name: string;
    description: string;
    is_actived?: boolean;
    url: string;
    setting_url: string;
}

@Component({
    selector: 'app-plugin',
    templateUrl: './plugin.component.html',
    styleUrls: ['./plugin.component.scss']
})
export class PluginComponent implements OnInit {

    public items: IPluginItem[] = [
        {
            code: 'taobaoke',
            name: '淘宝客',
            description: '淘宝客管理',
            icon: 'icon-gift',
            url: 'tbk',
            setting_url: 'tbk/setting'
        },
        {
            code: 'affiliate',
            name: '分销',
            description: '分销管理',
            icon: 'icon-group',
            url: 'affiliate',
            setting_url: 'affiliate/setting'
        },
    ];

    constructor(
        private http: HttpClient,
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
        this.pluginList().subscribe(res => {
            const map: any = {};
            for (const item of res.data) {
                map[item.code] = item.status === 1;
            }
            for (const item of this.items) {
                item.is_actived = map[item.code] === true;
            }
        });
    }

    public tapToggle(item: IPluginItem) {
        this.toastrService.confirm(item.is_actived ? `确认卸载"${item.name}"插件功能？` : `确认启用"${item.name}"插件功能？`, () => {
            this.pluginToggle(item.code).subscribe(res => {
                item.is_actived = res.status === 1;
            });
        });
    }

    private pluginList() {
        return this.http.get<IData<IShopPlugin>>('shop/admin/plugin');
    }

    private pluginToggle(code: string) {
        return this.http.post<IShopPlugin>('shop/admin/plugin/toggle', {code});
    }
}
