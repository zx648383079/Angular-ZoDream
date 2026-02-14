import { form } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { DialogService } from '../../../components/dialog';
import { ActivatedRoute } from '@angular/router';
import { SearchService, ThemeService } from '../../../theme/services';
import { IBlog, ICategory } from '../model';
import { BlogService } from './blog.service';
import { IItem } from '../../../theme/models/seo';

@Component({
    standalone: false,
    selector: 'app-member',
    templateUrl: './member.component.html',
    styleUrls: ['./member.component.scss']
})
export class MemberComponent {
    private readonly service = inject(BlogService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);
    private readonly themeService = inject(ThemeService);
    private readonly location = inject(Location);

    public categories: ICategory[] = [];
    public statusItems: IItem[] = [];

    public readonly items = signal<IBlog[]>([]);
    public readonly queries = form(signal({
        keywords: '',
        term: '0',
        status: '0',
        page: 1,
        per_page: 20,
    }));
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);

    constructor() {
        this.service.editOption().subscribe(res => {
            this.categories = res.categories;
            this.statusItems = res.publish_status;
        });
        this.themeService.titleChanged.next($localize `My Blog`);
        this.route.queryParams.subscribe(res => {
            this.searchService.getQueries(res, this.queries().value());
            this.tapPage();
        });
    }

    public tapBack() {
        this.location.back();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.queries.page().value() + 1);
    }

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.blogList(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading.set(false);
                this.items.set(res.data);
                this.total.set(res.paging.total);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
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

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapRemove(item: IBlog) {
        this.toastrService.confirm($localize `Are you sure to delete the "${item.title}"?`, () => {
            this.service.blogRemove(item.id).subscribe(res => {
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
