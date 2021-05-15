import { Component, OnInit } from '@angular/core';
import { DialogBoxComponent, DialogService } from '../../../dialog';
import { ICategory, IProvider } from '../../model';
import { LegworkService } from '../legwork.service';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.scss']
})
export class ProviderComponent implements OnInit {

    public items: IProvider[] = [];
    public hasMore = true;
    public page = 1;
    public perPage = 20;
    public isLoading = false;
    public total = 0;
    public keywords = '';
    public editData: IProvider = {} as any;

    constructor(
      private service: LegworkService,
      private toastrService: DialogService,
    ) {
        this.tapRefresh();
    }

    ngOnInit() {}

    public open(modal: DialogBoxComponent, item: IProvider) {
        this.editData = item;
        this.service.providerCategories(item.user_id).subscribe(res => {
            this.editData.categories = res.data;
        });
        modal.openCustom(value => {
            this.service.providerChange(this.editData?.id, value).subscribe(res => {
                this.toastrService.success('修改成功');
                this.tapPage();
            });
        });
    }

    public tapAllowCategory(item: ICategory) {
        this.service.providerCategoryChange(this.editData?.id, item.id, 1).subscribe(res => {
            this.toastrService.success('已允许分类成功');
            this.tapPage();
        });
    }

    public tapSearch(form: any) {
        this.keywords = form.keywords || '';
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.page);
    }

    public tapMore() {
        this.goPage(this.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.providerList({
            page,
            per_page: this.perPage
        }).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
        });
    }

    public tapRemove(item: any) {
        if (!confirm('确定删除“' + item.name + '”分类？')) {
            return;
        }
        this.service.categoryRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }
}
