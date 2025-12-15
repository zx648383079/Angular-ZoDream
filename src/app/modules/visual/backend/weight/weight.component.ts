import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ICategory, IThemeComponent } from '../../model';
import { IPageQueries } from '../../../../theme/models/page';
import { VisualService } from '../visual.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { SearchService } from '../../../../theme/services';

@Component({
    standalone: false,
  selector: 'app-weight',
  templateUrl: './weight.component.html',
  styleUrls: ['./weight.component.scss']
})
export class WeightComponent implements OnInit {
    private readonly service = inject(VisualService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly searchService = inject(SearchService);


    public items: IThemeComponent[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        category: 0,
        user: 0,
        page: 1,
        per_page: 20
    }));
    public categories: ICategory[] = [];
    public isMultiple = false;
    public isChecked = false;

    ngOnInit() {
        this.service.categoryTree().subscribe(res => {
            this.categories = res.data;
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
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

    public get checkedItems() {
        return this.items.filter(i => i.checked);
    }

    public toggleCheck(item?: IThemeComponent) {
        if (!item) {
            this.isChecked = !this.isChecked;
            this.items.forEach(i => {
                i.checked = this.isChecked;
            });
            return;
        }
        item.checked = !item.checked;
        if (!item.checked) {
            this.isChecked = false;
            return;
        }
        if (this.checkedItems.length === this.items.length) {
            this.isChecked = true;
        }
    }

    public tapRemoveMultiple() {
        const items = this.checkedItems;
        if (items.length < 1) {
            this.toastrService.warning($localize `No item selected!`);
            return;
        }
        this.toastrService.confirm(`确认删除选中的${items.length}条组件？`, () => {
            this.service.componentRemove(items.map(i => i.id)).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.tapPage();
            });
        });
    }

    public tapCheckMultiple() {
        const items = this.checkedItems;
        if (items.length < 1) {
            this.toastrService.warning($localize `No item selected!`);
            return;
        }
        this.toastrService.confirm(`确认审核通过选中的${items.length}条组件？`, () => {
            this.service.componentReview(items.map(i => i.id), {status: 1}).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Update Successfully`);
                this.tapPage();
            });
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
        this.service.componentList(queries).subscribe({
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
