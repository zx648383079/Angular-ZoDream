import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { formatAgo } from '../../../../theme/utils';
import { ICmsColumn, ICmsContent, ICmsModel } from '../../model';
import { CmsService } from '../cms.service';
import { SearchService } from '../../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
    private readonly service = inject(CmsService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<ICmsContent[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        keywords: '',
        model: 0,
        parent: 0,
        site: 0,
        category: 0
    }));
    public columnItems: ICmsColumn[] = [];
    public model: ICmsModel;

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        })
    }

    public formatColumn(item: ICmsContent, field: ICmsColumn) {
        if (field.name === 'cat_id') {
            return item.category?.title;
        }
        if (field.name === 'user_id') {
            return item.user?.name;
        }
        if (['created_at', 'updated_at'].indexOf(field.name) >= 0) {
            return formatAgo(item[field.name]);
        }
        return item[field.name];
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

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.contentList({...queries}).subscribe(res => {
            this.isLoading.set(false);
            this.items.set(res.data);
            this.hasMore = res.paging.more;
            this.total.set(res.paging.total);
            this.queries().value.set(queries);
            this.searchService.applyHistory(queries, ['model', 'site', 'category', 'parent']);
            this.columnItems = (res as any).column;
            this.model = (res as any).model;
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapRemove(item: ICmsContent) {
        this.toastrService.confirm('确定删除“' + item.title + '”内容？', () => {
            this.service.contentRemove({...this.queries().value(), id: item.id}).subscribe(res => {
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
