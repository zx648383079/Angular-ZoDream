import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { DialogBoxComponent } from '../../../components/dialog';
import { IPageQueries } from '../../../theme/models/page';
import { applyHistory, getQueries } from '../../../theme/query';
import { emptyValidate } from '../../../theme/validators';
import { FinanceService } from '../finance.service';
import { IBudget } from '../model';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss']
})
export class BudgetComponent implements OnInit {

    public items: IBudget[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20,
    };
    public editData: IBudget = {
        id: undefined,
        name: '',
        cycle: 0,
        budget: 0,
    } as any;
    public cycleItems = ['一次', '每天', '每周', '每月', '每年'];

    constructor(
        private service: FinanceService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
            this.tapPage();
        });
    }

    /**
     * tapRefresh
     */
    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapMore() {
        this.goPage(this.queries.page + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.budgetList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                applyHistory(this.queries = queries);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: IBudget) {
        this.toastrService.confirm('确定删除“' + item.name + '”预算计划？', () => {
            this.service.budgetRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success('删除成功');
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
    }

    open(modal: DialogBoxComponent, item?: IBudget) {
        this.editData = item ? {...item} : {
            id: undefined,
            name: '',
            cycle: 0,
            budget: 0,
        } as any;
        modal.open(() => {
            this.service.budgetSave({...this.editData}).subscribe(_ => {
                this.toastrService.success('保存成功');
                this.tapPage();
            });
        }, () => {
            return !emptyValidate(this.editData.name);
        });
    }

}
