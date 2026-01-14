import { Component, OnInit, inject, signal } from '@angular/core';
import { ICategory } from '../../model';
import { BookService } from '../book.service';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-book-b-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
    private readonly service = inject(BookService);
    private readonly toastrService = inject(DialogService);


    public readonly items = signal<ICategory[]>([]);
    public readonly isLoading = signal(false);
    public readonly editForm = form(signal<ICategory>({
        id: 0,
        name: '',
    }), schemaPath => {
        required(schemaPath.name);
    });

    ngOnInit() {
        this.tapRefresh();
    }

    public open(modal: DialogEvent, item?: ICategory) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            return {...v};
        });
        modal.open(() => {
            this.service.categorySave(this.editForm().value()).subscribe(_ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapRefresh();
            });
        }, () => this.editForm().valid());
    }

    public tapRefresh() {
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
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items.update(v => {
                    return v.filter(it => {
                        return it.id !== item.id;
                    });
                });
            });
        });
    }
}
