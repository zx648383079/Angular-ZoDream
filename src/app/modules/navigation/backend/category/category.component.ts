import { Component, inject, signal } from '@angular/core';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { filterTree } from '../../../../theme/utils';
import { ISiteCategory } from '../../model';
import { NavigationService } from '../navigation.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-nav-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
    private readonly service = inject(NavigationService);
    private readonly toastrService = inject(DialogService);


    public readonly items = signal<ISiteCategory[]>([]);
    public readonly isLoading = signal(false);
    public readonly editForm = form(signal({
        id: 0,
        name: '',
        icon: '',
        parent_id: '0',
    }), schemaPath => {
        required(schemaPath.name);
    });
    public readonly categories = signal<ISiteCategory[]>([]);

    constructor() {
        this.load();
    }

    public open(modal: DialogEvent, item?: ISiteCategory) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.icon = item?.icon ?? '';
            v.parent_id = item?.parent_id as any ?? '0';
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
        this.service.categoryTree().subscribe({
            next: res => {
                this.items.set(res.data);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
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
