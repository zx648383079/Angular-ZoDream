import { Component, OnDestroy, OnInit, computed, effect, inject, signal, untracked } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { SearchService } from '../../../../theme/services';
import { MemberService } from '../member.service';
import { form } from '@angular/forms/signals';
import { asyncScheduler, Subject, throttleTime } from 'rxjs';


interface IGroupHeader {
    id: number;
    icon: string;
    name: string;
    meta: string;
}

@Component({
    standalone: false,
    selector: 'app-member-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnDestroy {
    private readonly service = inject(MemberService);
    private readonly toastrService = inject(DialogService);
    private readonly searchService = inject(SearchService);


    public readonly dataForm = form(signal({
        accept_new_bulletin: true,
        open_not_disturb: false,
        upload_add_water: false,
        post_expiration: 0,
    }));
    public readonly tabItems: IGroupHeader[] = [
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

    public readonly crumbs = signal<IGroupHeader[]>([]);
    private readonly $afterDelay = new Subject<void>();

    constructor() {
        this.service.settings().subscribe(res => {
            this.dataForm().value.update(v => {
                return this.searchService.getQueries(res, v);
            });
        });
        this.$afterDelay.pipe(throttleTime(5000, asyncScheduler, { leading: false, trailing: true }))
                    .subscribe(() => this.tapSubmit());
        effect(() => {
            this.dataForm().value();
            untracked(() => {
                this.$afterDelay.next();
            });
        });
    }

    public readonly tabIndex = computed(() => {
        const items = this.crumbs();
        return items.length < 1 ? 0 : items[items.length - 1].id;
    });

    public readonly routeTitle = computed(() => {
        const items = this.crumbs();
        return items.length > 0 ? items[items.length - 1].name : $localize `Settings`;
    });

    ngOnDestroy(): void {
        this.$afterDelay.unsubscribe();
        this.tapSubmit();
    }

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
        if (this.crumbs().length > 0) {
            this.crumbs.update(v => {
                v.pop();
                return [...v];
            });
            return;
        }
        history.back();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (!this.dataForm().dirty()) {
            // this.toastrService.warning($localize `Form filling unchanged`);
            return;
        }
        e?.enter();
        const data = this.dataForm().value();
        this.service.settingsSave(data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Save successfully`);
            }, error: err => {
                e?.reset();
                this.toastrService.warning(err.error.message);
            }
        });
    }

}
