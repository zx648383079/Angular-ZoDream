import { Component, OnInit, inject, signal } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { ICategory } from '../../model';
import { BlogService } from '../blog.service';

@Component({
    standalone: false,
    selector: 'app-blog-b-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
    private readonly service = inject(BlogService);
    private readonly toastrService = inject(DialogService);


    public readonly items = signal<ICategory[]>([]);
    public readonly isLoading = signal(false);

    constructor() {
        this.tapRefresh();
    }

    /**
     * tapRefresh
     */
    public tapRefresh() {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        this.service.getCategories().subscribe({
            next: res => {
                this.items.set(res);
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
                this.items.update(v => {
                    return v.filter(it => {
                        return it.id !== item.id;
                    });
                });
            });
        });
    }

}
