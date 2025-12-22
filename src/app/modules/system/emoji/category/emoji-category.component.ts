import { Component, inject, signal } from '@angular/core';
import { DialogBoxComponent, DialogService } from '../../../../components/dialog';
import { IEmojiCategory } from '../../../../theme/models/seo';
import { emptyValidate } from '../../../../theme/validators';
import { SystemService } from '../../system.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-emoji-category',
    templateUrl: './emoji-category.component.html',
    styleUrls: ['./emoji-category.component.scss']
})
export class EmojiCategoryComponent {
    private readonly service = inject(SystemService);
    private readonly toastrService = inject(DialogService);


    public readonly items = signal<IEmojiCategory[]>([]);
    public readonly isLoading = signal(false);
    public readonly queries = form(signal({
        keywords: ''
    }));
    public readonly editForm = form(signal<IEmojiCategory>({
        id: 0,
        name: '',
        icon: '',
    }), schemaPath => {
        required(schemaPath.name);
    });

    constructor() {
        this.tapRefresh();
    }

    /**
     * tapRefresh
     */
    public tapRefresh() {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        this.service.emojiCategoryList(this.queries().value()).subscribe({
            next: res => {
                this.items.set(res.data);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public tapSearch() {
        this.tapRefresh();
    }

    public tapRemove(item: any) {
        this.toastrService.confirm('确定删除“' + item.name + '”分组？', () => {
            this.service.emojiCategoryRemove(item.id).subscribe(res => {
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

    public tapView(modal: DialogBoxComponent, item?: any) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.icon = item?.icon ?? '';
            return v;
        });
        modal.open(() => {
            this.service.emojiCategorySave(this.editForm().value()).subscribe(res => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapRefresh();
            });
        }, () => this.editForm().valid());
    }

}
