import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IBotMenuItem } from '../../model';
import { BotService } from '../bot.service';
import { ButtonEvent } from '../../../../components/form';
import { eachObject } from '../../../../theme/utils';

@Component({
  selector: 'app-bot-m-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {


    public menuItems: IBotMenuItem[] = [];
    public editData: any;
    public editorData: any;

    constructor(
        private service: BotService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.service.menuList({}).subscribe(res => {
            this.menuItems = res.data;
        });
    }

    public tapAddMenu(parent?: any) {
        const items = parent ? parent.children : this.menuItems;
        const newItem: any = {
            name: '新菜单项' + items.length
        };
        if (parent) {
            items.push(newItem);
        } else {
            newItem.chilren = [];
            items.push(newItem);
        }
        this.editData = newItem;
        this.editorData = {};
    }

    public tapEditMenu(item: any) {
        this.editData = item;
        this.editorData = {...item};
    }

    public onEditorChange() {
        eachObject(this.editorData, (v, k) => {
            this.editData[k] = v;
        });
        if (!this.editData.children && this.editData.type == 99) {
            this.editData.children = [];
        }
    }

    public tapClear() {
        this.menuItems = [];
        this.editData = undefined;
    }

    public tapRemoveItem() {
        if (!this.editData) {
            return;
        }
        this.toastrService.confirm('确定删除此菜单项？', () => {
            for (let i = 0; i < this.menuItems.length; i++) {
                const element = this.menuItems[i];
                if (element === this.editData) {
                    this.menuItems.splice(i, 1);
                    this.editData = null;
                    return;
                }
                if (!element.children) {
                    continue;
                }
                for (let j = 0; j < element.children.length; j++) {
                    const it = element.children[j];
                    if (it === this.editData) {
                        element.children.splice(i, 1);
                        this.editData = null;
                        return;
                    }
                }
            }
        });
    }

    public tapSubmit(e?: ButtonEvent) {
        e?.enter();
        this.service.menuBatchSave(this.menuItems).subscribe({
            next: res => {
                this.menuItems = res.data;
                e?.reset();
                this.toastrService.success($localize `Save Successfully`);
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }

    public tapAsync(e?: ButtonEvent) {
        this.toastrService.confirm('请先保存菜单，继续发布？', () => {
            e?.enter();
            this.service.menuAsync().subscribe({
                next: _ => {
                    e?.reset();
                    this.toastrService.success('发布成功');
                },
                error: err => {
                    e?.reset();
                    this.toastrService.error(err);
                }
            });
        });
    }
}
