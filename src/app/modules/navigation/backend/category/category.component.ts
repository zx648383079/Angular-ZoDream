import { Component, OnInit } from '@angular/core';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { filterTree } from '../../../../theme/utils';
import { emptyValidate } from '../../../../theme/validators';
import { ISiteCategory } from '../../model';
import { NavigationService } from '../navigation.service';

@Component({
    standalone: false,
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

    public items: ISiteCategory[] = [];
    public isLoading = false;
    public editData: ISiteCategory = {} as any;
    public categories: ISiteCategory[] = [];

    constructor(
        private service: NavigationService,
        private toastrService: DialogService,
    ) {
    }

    ngOnInit() {
        this.load();
    }

    public open(modal: DialogEvent, item?: ISiteCategory) {
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
        this.service.categoryTree().subscribe({
            next: res => {
                this.items = res.data;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapRemove(item: ISiteCategory) {
        this.toastrService.confirm('确定删除“' + item.name + '”分类？', () => {
            this.service.categoryRemove(item.id).subscribe(res => {
                this.load();
            });
        });
    }

}
