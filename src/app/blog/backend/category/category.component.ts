import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../dialog';
import { ICategory } from '../../../theme/models/blog';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

    public items: ICategory[] = [];

    public isLoading = false;

    constructor(
        private service: BlogService,
        private toastrService: DialogService,
    ) {
        this.tapRefresh();
    }

    ngOnInit() {}

    /**
     * tapRefresh
     */
    public tapRefresh() {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.getCategories().subscribe({
            next: res => {
                this.items = res;
            },
            complete: () => {
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
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
    }

}
