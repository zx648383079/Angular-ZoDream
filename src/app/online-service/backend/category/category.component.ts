import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DialogBoxComponent } from '../../../theme/components';
import { emptyValidate } from '../../../theme/validators';
import { ICategory } from '../../model';
import { OnlineBackendService } from '../online.service';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

    public items: ICategory[] = [];
    public hasMore = true;
    public page = 1;
    public perPage = 20;
    public isLoading = false;
    public total = 0;
    public keywords = '';
    public editData: ICategory = {} as any;

    constructor(
        private service: OnlineBackendService,
        private toastrService: ToastrService,
    ) {
        this.tapRefresh();
    }

    ngOnInit() {}


    public open(modal: DialogBoxComponent, item?: ICategory) {
        this.editData = item ? Object.assign({}, item) : {
            id: 0,
            name: '',
        };
        modal.open(() => {
            this.service.categorySave(this.editData).subscribe(_ => {
                this.toastrService.success('保存成功');
                this.tapPage();
            });
        }, () => !emptyValidate(this.editData.name));
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
        this.service.categoryList({
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
