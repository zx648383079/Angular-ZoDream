import { Component, OnInit } from '@angular/core';
import { DialogBoxComponent, DialogService } from '../../../../components/dialog';
import { IEmojiCategory } from '../../../../theme/models/seo';
import { emptyValidate } from '../../../../theme/validators';
import { SystemService } from '../../system.service';

@Component({
  selector: 'app-emoji-category',
  templateUrl: './emoji-category.component.html',
  styleUrls: ['./emoji-category.component.scss']
})
export class EmojiCategoryComponent implements OnInit {

    public items: IEmojiCategory[] = [];
    public isLoading = false;
    public keywords = '';
    public editData: IEmojiCategory = {} as any;

    constructor(
        private service: SystemService,
        private toastrService: DialogService,
    ) {
        this.tapRefresh();
    }

    ngOnInit() {
    }

    /**
     * tapRefresh
     */
    public tapRefresh() {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.emojiCategoryList({
            keywords: this.keywords,
        }).subscribe({
            next: res => {
                this.items = res.data;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.keywords = form.keywords || '';
        this.tapRefresh();
    }

    public tapRemove(item: any) {
        this.toastrService.confirm('确定删除“' + item.name + '”分组？', () => {
            this.service.emojiCategoryRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success('删除成功');
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
    }

    public tapView(modal: DialogBoxComponent, item?: any) {
        this.editData = item ? {...item} : {
            id: 0,
            name: '',
            icon: '',
        };
        modal.open(() => {
            this.service.emojiCategorySave(this.editData).subscribe(res => {
                this.toastrService.success('保存成功');
                this.tapRefresh();
            });
        }, () => !emptyValidate(this.editData.name));
    }

}
