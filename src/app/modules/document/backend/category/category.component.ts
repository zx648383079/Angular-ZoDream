import { Component, OnInit, inject } from '@angular/core';
import { emptyValidate } from '../../../../theme/validators';
import { ICategory } from '../../model';
import { DocumentService } from '../document.service';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { filterTree, toggleTreeItem } from '../../../../theme/utils';

@Component({
    standalone: false,
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
    private readonly service = inject(DocumentService);
    private readonly toastrService = inject(DialogService);


    public items: ICategory[] = [];
    public isLoading = false;
    public editData: ICategory = {} as any;
    public categories: ICategory[] = [];

    ngOnInit() {
        this.load();
    }

    public toggleTree(i: number) {
        this.items = toggleTreeItem(this.items, i);
    }

    public onHotChange(item: ICategory) {
        this.service.categorySave(item).subscribe({
            next: () => {
                this.toastrService.success($localize `Save Successfully`);
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
        };
        this.categories = !item ? this.items : filterTree(this.items, item.id);
        modal.open(() => {
            this.service.categorySave(this.editData).subscribe({
                next: () => {
                    this.toastrService.success($localize `Save Successfully`);
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
