import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../../dialog';
import { ICategory } from '../../../../theme/models/shop';
import { GoodsService } from '../goods.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

    public categories: ICategory[] = [];

    constructor(
        private service: GoodsService,
        private toastrService: DialogService,
    ) {
    }

    ngOnInit() {
        this.service.categoryTree().subscribe(res => {
            this.categories = res.data;
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
