import { Component, OnInit } from '@angular/core';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { filterTree } from '../../../../theme/utils';
import { emptyValidate } from '../../../../theme/validators';
import { ICategory } from '../../model';
import { ResourceService } from '../resource.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

    public items: ICategory[] = [];
    public isLoading = false;
    public editData: ICategory = {} as any;
    public categories: ICategory[] = [];

    constructor(
        private service: ResourceService,
        private toastrService: DialogService,
    ) {
    }

    ngOnInit() {
        this.load();
    }

    public onHotChange(item: ICategory) {
        this.service.categorySave(item).subscribe({
            next: () => {
                this.toastrService.success('保存成功');
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public open(modal: DialogEvent, item?: ICategory) {
        this.editData = item ? Object.assign({}, item) : {
            id: 0,
            name: '',
            icon: '',
            parent_id: 0,
            is_hot: 0,
        };
        this.categories = !item ? this.items : filterTree(this.items, item.id);
        modal.open(() => {
            this.service.categorySave(this.editData).subscribe({
                next: () => {
                    this.toastrService.success('保存成功');
                    this.load();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => {
            return !emptyValidate(this.editData.name);
        });
    }

    private load() {
        this.isLoading = true;
        this.service.categoryList().subscribe({
            next: res => {
                this.items = res.data;
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
                this.load();
            });
        });
    }

}
