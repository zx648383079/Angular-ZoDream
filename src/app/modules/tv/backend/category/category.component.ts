import { Component, OnInit, inject, signal } from '@angular/core';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { filterTree } from '../../../../theme/utils';
import { emptyValidate } from '../../../../theme/validators';
import { ICategory } from '../../model';
import { TVService } from '../tv.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
    private readonly service = inject(TVService);
    private readonly toastrService = inject(DialogService);


    public items: ICategory[] = [];
    public isLoading = false;
    public readonly editForm = form(signal<ICategory>({
        id: 0,
        name: '',
        icon: '',
        parent_id: 0,
    }), schemaPath => {
        required(schemaPath.name);
    });
    public categories: ICategory[] = [];

    ngOnInit() {
        this.load();
    }

    public open(modal: DialogEvent, item?: ICategory) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.icon = item?.icon ?? '';
            v.parent_id = item?.parent_id ?? 0;
            return v;
        });
        this.categories = !item ? this.items : filterTree(this.items, item.id);
        modal.open(() => {
            this.service.categorySave(this.editForm().value()).subscribe({
                next: () => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.load();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => this.editForm().valid());
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

    public tapRemove(item: ICategory) {
        this.toastrService.confirm('确定删除“' + item.name + '”分类？', () => {
            this.service.categoryRemove(item.id).subscribe(res => {
                this.load();
            });
        });
    }

}
