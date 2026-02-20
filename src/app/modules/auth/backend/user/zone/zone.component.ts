import { form, required } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { IUserZone } from '../../../../../theme/models/user';
import { IPageQueries } from '../../../../../theme/models/page';
import { AuthService } from '../../auth.service';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { SearchService } from '../../../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-backend-zone',
    templateUrl: './zone.component.html',
    styleUrls: ['./zone.component.scss']
})
export class ZoneComponent {
    private readonly service = inject(AuthService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IUserZone[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        page: 1,
        keywords: '',
        per_page: 20,
    }));
    public readonly editForm = form(signal<IUserZone>({
        id: 0,
        name: '',
        icon: '',
        decsription: '',
        is_open: 1,
        status: 1,
    }), schemaPath => {
        required(schemaPath.name);
    });

    constructor() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public open(modal: DialogEvent, item?: IUserZone) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.icon = item?.icon ?? '';
            v.decsription = item?.decsription ?? '';
            v.is_open = item?.is_open ?? 1;
            v.status = item?.status ?? 1;
            return {...v};
        });
        modal.open(() => {
            this.service.zoneSave(this.editForm().value()).subscribe({
                next: () => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => this.editForm().valid());
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.zoneList(queries).subscribe({
            next: res => {
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapRemove(item: IUserZone) {
        this.toastrService.confirm('确定移除“' + item.name + '”？', () => {
            this.service.zoneRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items.update(v => {
                    return v.filter(it => {
                        return it.id !== item.id;
                    });
                });
            });
        });
    }
}
