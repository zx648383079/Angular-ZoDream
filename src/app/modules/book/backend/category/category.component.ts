import { Component, OnInit, inject } from '@angular/core';
import { ICategory } from '../../model';
import { emptyValidate } from '../../../../theme/validators';
import { BookService } from '../book.service';
import { DialogEvent, DialogService } from '../../../../components/dialog';

@Component({
    standalone: false,
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
    private readonly service = inject(BookService);
    private readonly toastrService = inject(DialogService);


    public items: ICategory[] = [];
    public isLoading = false;
    public readonly editForm = form(signal<ICategory>({}));

    ngOnInit() {
        this.tapRefresh();
    }

    public open(modal: DialogEvent, item?: ICategory) {
        this.editForm().value.update(v => {
            if (item) {
                v.id = item.id;
                return v;
            }
            return {};
        });{
            id: 0,
            name: '',
        };
        modal.open(() => {
            this.service.categorySave(this.editForm().value()).subscribe(_ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapRefresh();
            });
        }, () => {
            return !emptyValidate(this.editForm.name);
        });
    }

    public tapRefresh() {
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
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
    }
}
