import { form, required } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { IItem } from '../../../../theme/models/seo';
import { SearchService } from '../../../../theme/services';
import { mapFormat } from '../../../../theme/utils';
import { IShortLink } from '../../model';
import { ShortLinkService } from '../short-link.service';

@Component({
    standalone: false,
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent {
    private readonly service = inject(ShortLinkService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IShortLink[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        keywords: '',
        user: 0,
        status: 0,
        page: 1,
        per_page: 20
    }));
    public readonly editForm = form(signal({
        id: 0,
        title: '',
        short_url: '',
        status: '0',
        source_url: '',
        complete_short_url: '',
    }), schemaPath => {
        required(schemaPath.short_url);
    });
    public statusItems: IItem[] = [
        {name: '待审核', value: 0},
        {name: '正常', value: 5},
        {name: '过期', value: 7},
        {name: '禁止', value: 9},
    ]

    constructor() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }


    public formatStatus(v: number) {
        return mapFormat(v, this.statusItems);
    }

    public tapEdit(modal: DialogEvent, item?: IShortLink) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.title = item?.title ?? '';
            v.source_url = item?.source_url ?? '';
            return {...v};
        });
        modal.open(() => {
            this.service.linkSave(this.editForm().value()).subscribe({
                next: () => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.tapPage();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => this.editForm().valid());
    }

    /**
     * tapRefresh
     */
    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.linkList(queries).subscribe({
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

    public tapRemove(item: IShortLink) {
        this.toastrService.confirm('确定删除“' + item.source_url + '”链接？', () => {
            this.service.linkRemove(item.id).subscribe(res => {
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
