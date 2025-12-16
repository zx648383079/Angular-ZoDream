import { Component, OnInit, inject, signal } from '@angular/core';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { filterTree } from '../../../../theme/utils';
import { ICategory } from '../../model';
import { VisualService } from '../visual.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
    private readonly service = inject(VisualService);
    private readonly toastrService = inject(DialogService);


    public items: ICategory[] = [];
    public isLoading = false;
    public readonly editForm = form(signal({
        id: 0,
        name: '',
        thumb: '',
        parent_id: '',
    }), schemaPath => {
        required(schemaPath.name);
    });
    public categories: ICategory[] = [];

    ngOnInit() {
        this.load();
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
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.thumb = item?.thumb ?? '';
            v.parent_id = item?.parent_id as any ?? '';
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
