import { Component, OnInit } from '@angular/core';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { filterTree } from '../../../../../theme/utils';
import { emptyValidate } from '../../../../../theme/validators';
import { IBotTemplateCategory } from '../../../model';
import { BotService } from '../../bot.service';

@Component({
    standalone: false,
  selector: 'app-bot-template-category',
  templateUrl: './template-category.component.html',
  styleUrls: ['./template-category.component.scss']
})
export class TemplateCategoryComponent implements OnInit {

    public items: IBotTemplateCategory[] = [];
    public isLoading = false;
    public editData: any;
    public filterItems: IBotTemplateCategory[] = [];

    constructor(
        private service: BotService,
        private toastrService: DialogService,
    ) {
    }

    ngOnInit() {
        this.tapRefresh();
    }

    public tapRefresh() {
        this.isLoading = true;
        this.service.batch({
            template_category: {}
        }).subscribe({
            next: res => {
                this.items = res.template_category;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public open(modal: DialogEvent, item?: IBotTemplateCategory) {
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

    public tapRemove(item: IBotTemplateCategory) {
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
