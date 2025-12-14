import { Component, OnInit, inject, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { CateringService } from '../../catering.service';
import { ICateringCategory, ICateringPatron, ICateringPatronGroup } from '../../model';
import { CustomDialogComponent } from '../goods/custom-dialog/custom-dialog.component';

@Component({
    standalone: false,
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
    private readonly service = inject(CateringService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private searchService = inject(SearchService);

    private readonly customModal = viewChild(CustomDialogComponent);

    public items: ICateringPatron[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        group: 0,
        keywords: '',
        page: 1,
        per_page: 20
    };
    public categoryItems: ICateringPatronGroup[] = [];
    public editGroupData: any = {
        name: '',
        discount: 100,
    };

    ngOnInit() {
        this.service.merchantPatronGroup().subscribe(res => {
            this.categoryItems = res.data;
        });
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public tapEditCategory(item?: ICateringPatronGroup) {
        this.editGroupData = item ? {...item} : {
            name: '',
            discount: 100,
        };
        this.customModal().open(value => {
            this.service.merchantPatronGroupSave({...this.editGroupData, name: value}).subscribe(res => {
                if (item) {
                    this.categoryItems = this.categoryItems.map(i => {
                        return i.id == res.id ? res : i;
                    });
                } else {
                    this.categoryItems.push(res);
                }
            });
        });
    }

    public tapRemoveCategory(item: ICateringPatronGroup) {
        this.service.merchantPatronGroupRemove(item.id).subscribe(_ => {
            this.categoryItems = this.categoryItems.filter(i => i.id !== item.id);
        });
    }

    public tapCategory(item?: ICateringPatronGroup) {
        this.queries.group = item?.id || 0;
        this.tapRefresh();
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
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
        this.service.merchantPatronList(queries).subscribe({
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

}
