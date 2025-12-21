import { Component, OnInit, inject, signal } from '@angular/core';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { filterTree } from '../../../../../theme/utils';
import { IBotTemplateCategory } from '../../../model';
import { BotService } from '../../bot.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-bot-template-category',
    templateUrl: './template-category.component.html',
    styleUrls: ['./template-category.component.scss']
})
export class TemplateCategoryComponent implements OnInit {
    private readonly service = inject(BotService);
    private readonly toastrService = inject(DialogService);


    public readonly items = signal<IBotTemplateCategory[]>([]);
    public readonly isLoading = signal(false);
    public readonly editForm = form(signal({
        id: 0,
        name: '',
        parent_id: '0'
    }), schemaPath => {
        required(schemaPath.name);
    });
    public filterItems: IBotTemplateCategory[] = [];

    ngOnInit() {
        this.tapRefresh();
    }

    public tapRefresh() {
        this.isLoading.set(true);
        this.service.batch({
            template_category: {}
        }).subscribe({
            next: res => {
                this.items.set(res.template_category);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public open(modal: DialogEvent, item?: IBotTemplateCategory) {
        this.editForm().value.update(v => {
            v.name = item?.name ?? '';
            return v;
        });
        this.filterItems = item ? filterTree(this.items(), item.id) : this.items();
        modal.open(() => {
            this.service.categorySave(this.editForm().value()).subscribe({
                next: _ => {
                    this.toastrService.success('添加成功');
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            })
        }, () => this.editForm().valid());
    }

    public tapRemove(item: IBotTemplateCategory) {
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
