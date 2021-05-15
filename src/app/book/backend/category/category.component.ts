import { Component, OnInit } from '@angular/core';
import { ICategory } from '../../model';
import { emptyValidate } from '../../../theme/validators';
import { BookService } from '../book.service';
import { DialogBoxComponent, DialogService } from '../../../dialog';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

    public items: ICategory[] = [];
    public editData: ICategory = {} as any;

    constructor(
        private service: BookService,
        private toastrService: DialogService,
    ) {}

    ngOnInit() {
        this.tapRefresh();
    }

    public open(modal: DialogBoxComponent, item?: ICategory) {
        this.editData = item ? Object.assign({}, item) : {
            id: 0,
            name: '',
        };
        modal.open(() => {
            this.service.categorySave(this.editData).subscribe(_ => {
                this.toastrService.success('保存成功');
                this.tapRefresh();
            });
        }, () => {
            return !emptyValidate(this.editData.name);
        });
    }

    public tapRefresh() {
        this.service.categoryList().subscribe(res => {
            this.items = res.data;
        });
    }

    public tapRemove(item: ICategory) {
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
