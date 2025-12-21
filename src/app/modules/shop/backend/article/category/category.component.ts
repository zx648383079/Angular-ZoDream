import { Component, OnInit, inject, signal } from '@angular/core';
import { DialogService } from '../../../../../components/dialog';
import { IArticleCategory } from '../../../model';
import { ArticleService } from '../../article.service';

@Component({
    standalone: false,
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
    private readonly service = inject(ArticleService);
    private readonly toastrService = inject(DialogService);


    public categories: IArticleCategory[] = [];
    public readonly isLoading = signal(false);

    constructor() {
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

    ngOnInit() {}

    public tapRemove(item: IArticleCategory) {
        this.toastrService.confirm('确定删除“' + item.name + '”分类？', () => {
            this.service.articleRemove(item.id).subscribe(res => {
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
