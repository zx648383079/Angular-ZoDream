import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../../../components/dialog';
import { ICategory } from '../../../model';
import { GoodsService } from '../goods.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

    public categories: ICategory[] = [];
    public isLoading = false;

    constructor(
        private service: GoodsService,
        private toastrService: DialogService,
    ) {
    }

    ngOnInit() {
        this.isLoading = true;
        this.service.categoryTree().subscribe({
            next: res => {
                this.categories = res.data;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapRemove(item: ICategory) {
        this.toastrService.confirm('确定删除“' + item.name + '”分类？', () => {
            this.service.categoryRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success('删除成功');
                this.categories = this.categories.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
    }

}
