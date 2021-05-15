import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../../dialog';
import { IErrorResult } from '../../../../theme/models/page';
import { LegworkService } from '../../../legwork.service';
import { ICategory, IService } from '../../../model';

@Component({
  selector: 'app-apply-service',
  templateUrl: './apply-service.component.html',
  styleUrls: ['./apply-service.component.scss']
})
export class ApplyServiceComponent implements OnInit {

    public categories: ICategory[] = [];
    public category = 0;
    public items: IService[] = [];
    public page = 1;
    public hasMore = true;
    public isLoading = false;
    public keywords = '';

    constructor(
        private service: LegworkService,
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
        this.service.categoryList().subscribe(res => {
            this.categories = res.data;
        });
        this.tapRefresh();
    }

    public tapApply(item: IService) {
        this.service.waiterServiceApply(item.id).subscribe(_ => {
            this.toastrService.success('已提交申请，等待审核');
        }, (err: IErrorResult) => {
            this.toastrService.warning(err.error.message);
        });
    }

    public tapSearch(form: any) {
        this.keywords = form.keywords || '';
        this.tapRefresh();
    }

    public tapCategory(item?: ICategory) {
        this.category = item ? item.id : 0;
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.waiterServiceList({
            keywords: this.keywords,
            category: this.category,
            all: true,
            page
        }).subscribe(res => {
            this.page = page;
            this.hasMore = res.paging.more;
            this.isLoading = false;
            this.items = page < 2 ? res.data : [].concat(this.items, res.data);
        }, () => {
            this.isLoading = false;
        });
    }

}
