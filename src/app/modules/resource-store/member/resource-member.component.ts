import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ICategory, IResource } from '../model';
import { IPageQueries } from '../../../theme/models/page';
import { ResourceService } from './resource.service';
import { DialogService } from '../../../components/dialog';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-resource-member',
    templateUrl: './resource-member.component.html',
    styleUrls: ['./resource-member.component.scss']
})
export class ResourceMemberComponent implements OnInit {
private readonly service = inject(ResourceService);
private readonly toastrService = inject(DialogService);
private readonly route = inject(ActivatedRoute);
private readonly searchService = inject(SearchService);


public items: IResource[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal({
        keywords: '',
        category: '',
        type: 0,
        page: 1,
        per_page: 20
    }));
    public categories: ICategory[] = [];

    ngOnInit() {
        this.service.categoryAll().subscribe(res => {
            this.categories = res;
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
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
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.resourceList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch() {

        this.tapRefresh();
    }

    public tapRemove(item: IResource) {
        this.toastrService.confirm($localize `Are you sure to delete"${item.title}"?`, () => {
            this.service.resourceRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        })
    }

}
