import { Component, OnInit, inject, signal } from '@angular/core';
import { DialogService } from '../../../../../components/dialog';
import { ICategory } from '../../../model';
import { GoodsService } from '../goods.service';

@Component({
    standalone: false,
    selector: 'app-shop-goods-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
    private readonly service = inject(GoodsService);
    private readonly toastrService = inject(DialogService);


    public categories: ICategory[] = [];
    public readonly isLoading = signal(false);

    ngOnInit() {
        this.isLoading.set(true);
        this.service.categoryTree().subscribe({
            next: res => {
                this.categories = res.data;
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public tapRemove(item: ICategory) {
        this.toastrService.confirm('确定删除“' + item.name + '”分类？', () => {
            this.service.categoryRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.categories = this.categories.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
    }

}
