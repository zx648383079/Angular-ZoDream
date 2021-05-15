import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../dialog';
import { DialogBoxComponent } from '../../dialog';
import { emptyValidate } from '../../theme/validators';
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
    public page = 1;
    public perPage = 20;
    public isLoading = false;
    public total = 0;
    public keywords = '';
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
    ) {}

    ngOnInit() {
        this.tapRefresh();
    }

    /**
     * tapRefresh
     */
    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.page);
    }

    public tapMore() {
        this.goPage(this.page + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.budgetList({
            keywords: this.keywords,
            page,
            per_page: this.perPage
        }).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
        });
    }

    public tapSearch(form: any) {
        this.keywords = form.keywords;
        this.tapRefresh();
    }

    public tapRemove(item: IBudget) {
        if (!confirm('确定删除“' + item.name + '”预算计划？')) {
            return;
        }
        this.service.budgetRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.items = this.items.filter(it => {
                return it.id !== item.id;
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
