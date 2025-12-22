import { form, required } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ISitePage } from '../../../model';
import { IPageQueries } from '../../../../../theme/models/page';
import { VisualService } from '../../visual.service';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-site-page',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.scss']
})
export class SitePageComponent implements OnInit {
    private readonly service = inject(VisualService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<ISitePage[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        site: 0,
        page: 1,
        per_page: 20
    }));
    public readonly editForm = form(signal({
        id: 0,
        name: '',
        title: '',
        thumb: '',
        keywords: '',
        description: '',
        site_id: 0,
        is_default: false,
        settings: {
            cache_time: 0,
        }
    }), schemaPath => {
        required(schemaPath.name);
    });

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public open(modal: DialogEvent, item: ISitePage) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.title = item?.title ?? '';
            v.thumb = item?.thumb ?? '';
            v.keywords = item?.keywords ?? '';
            v.description = item?.description ?? '';
            v.site_id = item?.site_id ?? 0;
            v.settings = item?.settings ?? {};
            return v;
        });
        modal.open(() => {
            this.service.sitePageSave(this.editForm().value()).subscribe({
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

    public tapPreview(item: ISitePage) {
        this.service.gotoEditor(item, true);
    }

    public tapEditor(item: ISitePage) {
        this.service.gotoEditor(item, false);
    }

    public tapBack() {
        history.back();
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
        this.service.sitePageList(queries).subscribe({
            next: res => {
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.queries().value.set(queries);
            this.searchService.applyHistory(queries, ['site']);
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

    public tapRemove(item: ISitePage) {
        this.toastrService.confirm($localize `Are you sure to delete "${item.title}"?`, () => {
            this.service.sitePageRemove(item.id).subscribe(res => {
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
