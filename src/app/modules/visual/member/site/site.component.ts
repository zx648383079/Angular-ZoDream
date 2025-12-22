import { Component, OnInit, inject, signal } from '@angular/core';
import { ISite } from '../../model';
import { IPageQueries } from '../../../../theme/models/page';
import { VisualService } from '../visual.service';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../../theme/services';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-site',
    templateUrl: './site.component.html',
    styleUrls: ['./site.component.scss']
})
export class SiteComponent implements OnInit {
    private readonly service = inject(VisualService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<ISite[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20
    }));
    public readonly editForm = form(signal<ISite>({
        id: 0,
        name: '',
        thumb: '',
        logo: '',
        title: '',
        keywords: '',
        description: '',
        domain: '',
        is_share: false,
        share_price: 0,
        status: 0,
    }), schemaPath => {
        required(schemaPath.name);
    });

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public open(modal: DialogEvent, item?: ISite) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.thumb = item?.thumb ?? '';
            v.logo = item?.logo ?? '';
            v.title = item?.title ?? '';
            v.keywords = item?.keywords ?? '';
            v.description = item?.description ?? '';
            v.domain = item?.domain ?? '';
            v.is_share = item?.is_share ?? false;
            v.share_price = item?.share_price ?? 0;
            v.status = item?.status ?? 0;
            return v;
        });
        modal.open(() => {
            this.service.siteSave(this.editForm().value()).subscribe({
                next: () => {
                    this.toastrService.success($localize `Save Successfully`);
                    if (item) {
                        this.tapPage();
                    } else {
                        this.tapRefresh();
                    }
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
        this.service.siteList(queries).subscribe({
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

    public tapSearch() {

        this.tapRefresh();
    }

    public tapRemove(item: ISite) {
        this.toastrService.confirm($localize `Are you sure to delete"${item.name}"?`, () => {
            this.service.siteRemove(item.id).subscribe(res => {
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
        })
    }

}
