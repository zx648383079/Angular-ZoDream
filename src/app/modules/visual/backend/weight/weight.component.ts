import { Component, OnInit } from '@angular/core';
import { ICategory, IThemeComponent } from '../../model';
import { IPageQueries } from '../../../../theme/models/page';
import { VisualService } from '../visual.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { SearchService } from '../../../../theme/services';

@Component({
  selector: 'app-weight',
  templateUrl: './weight.component.html',
  styleUrls: ['./weight.component.scss']
})
export class WeightComponent implements OnInit {

    public items: IThemeComponent[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        category: 0,
        user: 0,
        page: 1,
        per_page: 20
    };
    public categories: ICategory[] = [];

    constructor(
        private service: VisualService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private router: Router,
        private searchService: SearchService,
    ) {
    }

    ngOnInit() {
        this.service.categoryTree().subscribe(res => {
            this.categories = res.data;
        });
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public tapCreate() {
        if (this.categories.length > 0) {
            this.router.navigate(['create'], {relativeTo: this.route});
            return;
        }
        this.toastrService.warning($localize `Please add categories first`);
        this.router.navigate(['../category'], {relativeTo: this.route});
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapMore() {
        this.goPage(this.queries.page + 1);
    }

    
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.componentList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: IThemeComponent) {
        this.toastrService.confirm('确定删除“' + item.name + '”组件？', () => {
            this.service.componentRemove(item.id).subscribe(res => {
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
