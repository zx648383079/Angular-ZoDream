import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../../../components/dialog';
import { IArticleCategory } from '../../../model';
import { ArticleService } from '../../article.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

    public categories: IArticleCategory[] = [];
    public isLoading = false;

    constructor(
        private service: ArticleService,
        private toastrService: DialogService,
    ) {
        this.isLoading = true;
        this.service.categoryTree().subscribe({
            next: res => {
                this.categories = res.data;
            },
            complete: () => {
                this.isLoading = false;
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
                this.toastrService.success('删除成功');
                this.categories = this.categories.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
    }

}
