import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DialogService } from '../../../components/dialog';
import { ButtonEvent } from '../../../components/form';
import { SearchService } from '../../../theme/services';
import { UserService } from '../user.service';
import { form } from '@angular/forms/signals';

interface IGroupHeader {
    id: number;
    icon: string;
    name: string;
    meta: string;
}

@Component({
    standalone: false,
    selector: 'app-b-user-setting',
    templateUrl: './user-setting.component.html',
    styleUrls: ['./user-setting.component.scss']
})
export class UserSettingComponent implements OnInit {
    private readonly service = inject(UserService);
    private readonly toastrService = inject(DialogService);
    private readonly searchService = inject(SearchService);

    public readonly dataForm = form(signal({
        accept_new_bulletin: true,
        open_not_disturb: false,
        post_expiration: 0,
        upload_add_water: false,
    }));
    public readonly isChanged = signal(false);

    public readonly tabItems: IGroupHeader[] = [
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

    public readonly crumbs = signal<IGroupHeader[]>([]);

    ngOnInit() {
        this.service.settings().subscribe(res => {
            this.dataForm().value.update(v => {
                return this.searchService.getQueries(res, v);
            });
            this.isChanged.set(false);
        });
    }

    public readonly tabIndex = computed(() => {
        const items = this.crumbs();
        return items.length < 1 ? 0 : items[items.length - 1].id;
    });

    public readonly crumbTitle = computed(() => {
        return ['个性化', ...this.crumbs().map(i => i.name)].join(' / ');
    });

    public tapTab(item: IGroupHeader) {
        this.crumbs.update(v => {
            for (let index = 0; index < v.length; index++) {
                if (v[index].id === item.id) {
                    v.splice(index + 1);
                    return [...v];
                }
            }
            return [...v, item];
        });
    }

    public tapBack() {
        this.crumbs.update(v => {
            v.pop();
            return [...v];
        });
    }

    public onValueChange() {
        this.isChanged.set(true);
    }

    public tapSubmit(e?: ButtonEvent) {
        if (!this.isChanged()) {
            this.toastrService.warning('表单填写未改变');
            return;
        }
        e?.enter();
        const data = this.dataForm().value();
        this.service.settingsSave(data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Save Successfully`);
                this.isChanged.set(false);
            }, error: err => {
                e?.reset();
                this.toastrService.warning(err.error.message);
            }
        });
    }

}
