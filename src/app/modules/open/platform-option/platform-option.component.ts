import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, input, signal } from '@angular/core';
import { DialogService } from '../../../components/dialog';
import { ButtonEvent } from '../../../components/form';
import { IPlatform } from '../../../theme/models/open';
import { IData, IDataOne } from '../../../theme/models/page';
import { FieldTree, form } from '@angular/forms/signals';
import { camelCase, eachObject } from '../../../theme/utils';


interface IOptionGroup {
    name: string,
    label: string,
    expanded: boolean;
    children: {
        name: string,
        label: string,
        tip?: string,
        value: string
    }[]
}

@Component({
    standalone: false,
    selector: 'app-platform-option',
    templateUrl: './platform-option.component.html',
    styleUrls: ['./platform-option.component.scss']
})
export class PlatformOptionComponent implements OnInit {
    private http = inject(HttpClient);
    private readonly toastrService = inject(DialogService);


    public readonly url = input<string>('');

    public platformItems: IPlatform[] = [];
    public readonly dataModel = signal<{
        platform: string,
        items: IOptionGroup[]
    }>({
        platform: '',
        items: []
    });
    public readonly dataForm = form(this.dataModel);

    ngOnInit() {
        this.http.get<IData<IPlatform>>(this.url() + '/platform').subscribe(res => {
            this.platformItems = res.data;
            if (res.data.length > 0) {
                this.dataForm.platform().value.set(res.data[0].id as any);
                this.tapPlatformChange();
            }
        });
    }

    public tapPlatformChange() {
        this.http.get<IData<any>>(this.url() + '/option', {
            params: {
                platform: this.dataForm.platform().value(),
            }
        }).subscribe(res => {
            const items = [];
            eachObject(res.data, (item, key) => {
                const group = {
                    name: key,
                    label: item._label,
                    expanded: true,
                    children: []
                };
                eachObject<string, any>(item, (val, i) => {
                    if (i.indexOf('_label') >= 0 || i.indexOf('_tip') >= 0) {
                        return;
                    }
                    group.children.push({
                        name: i,
                        label: Object.prototype.hasOwnProperty.call(item, i + '_label') ? item[i + '_label'] : camelCase(i),
                        tip: Object.prototype.hasOwnProperty.call(item, i + '_tip') ? item[i + '_tip'] : undefined,
                        value: val
                    });
                });
                items.push(group);
            });
            this.dataModel.update(v => {
                v.items = items;
                return v;
            });
        });
    }

    public saveOption(e?: ButtonEvent) {
        const option = {};
        for (const group of this.dataForm.items().value()) {
            const data = {};
            for (const item of group.children) {
                data[item.name] = item.value;
            }
            option[group.name] = data;
        }
        e?.enter();
        this.http.post<IDataOne<boolean>>(this.url() + '/save_option', {
            platform: this.dataForm.platform().value(),
            option,
        }).subscribe({
            next: res => {
                e?.reset();
                if (res.data) {
                    this.toastrService.success('配置保存成功');
                }
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }

    public toggleGroup(group: FieldTree<IOptionGroup>) {
        group.expanded().value.update(v => !v);
    }

}
