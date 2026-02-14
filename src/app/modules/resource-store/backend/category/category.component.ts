import { Component, inject, signal } from '@angular/core';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { filterTree } from '../../../../theme/utils';
import { ICategory } from '../../model';
import { ResourceService } from '../resource.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-rs-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
    private readonly service = inject(ResourceService);
    private readonly toastrService = inject(DialogService);


    public readonly items = signal<ICategory[]>([]);
    public readonly isLoading = signal(false);
    public readonly editForm = form(signal({
        id: 0,
        name: '',
        icon: '',
        parent_id: '0',
        is_hot: 0,
    }), schemaPath => {
        required(schemaPath.name);
    });
    public readonly categories = signal<ICategory[]>([]);

    constructor() {
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
            v.icon = item?.icon ?? '';
            v.parent_id = item?.parent_id as any ?? '0';
            v.is_hot = item?.is_hot ?? 0;
            return {...v};
        });
        this.categories.set(!item ? this.items() : filterTree(this.items(), item.id));
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
        this.isLoading.set(true);
        this.service.categoryList().subscribe({
            next: res => {
                this.items.set(res.data);
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
                this.load();
            });
        });
    }

}
