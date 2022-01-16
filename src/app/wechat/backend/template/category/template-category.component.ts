import { Component, OnInit } from '@angular/core';
import { DialogEvent, DialogService } from '../../../../dialog';
import { filterTree } from '../../../../theme/utils';
import { emptyValidate } from '../../../../theme/validators';
import { IWeChatTemplateCategory } from '../../../model';
import { WechatService } from '../../wechat.service';

@Component({
  selector: 'app-template-category',
  templateUrl: './template-category.component.html',
  styleUrls: ['./template-category.component.scss']
})
export class TemplateCategoryComponent implements OnInit {

    public items: IWeChatTemplateCategory[] = [];
    public editData: any;
    public filterItems: IWeChatTemplateCategory[] = [];

    constructor(
        private service: WechatService,
        private toastrService: DialogService,
    ) {
    }

    ngOnInit() {
        this.tapRefresh();
    }

    public tapRefresh() {
        this.service.batch({
            template_category: {}
        }).subscribe(res => {
            this.items = res.template_category;
        });
    }

    public open(modal: DialogEvent, item?: IWeChatTemplateCategory) {
        this.editData = item ? {...item} : {};
        this.filterItems = item ? filterTree(this.items, item.id) : this.items;
        modal.open(() => {
            this.service.categorySave(this.editData).subscribe({
                next: _ => {
                    this.toastrService.success('添加成功');
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            })
        }, () => !emptyValidate(this.editData.name));
    }

    public tapRemove(item: IWeChatTemplateCategory) {
        this.toastrService.confirm('确定删除“' + item.name + '”分类？', () => {
            this.service.categoryRemove(item.id).subscribe(res => {
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

}
