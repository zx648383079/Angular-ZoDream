import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IBotMenuItem } from '../../model';
import { BotService } from '../bot.service';
import { ButtonEvent } from '../../../../components/form';
import { eachObject } from '../../../../theme/utils';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-bot-m-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
    private readonly service = inject(BotService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);



    public menuItems: IBotMenuItem[] = [];
    // TODO 无效
    public readonly editForm = form(signal({
        name: '',
        type: 0,
        children: []
    }));
    public editorData: any;

    constructor() {
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
        this.editForm().value.set(newItem);
        this.editorData = {};
    }

    public tapEditMenu(item: any) {
        this.editForm().value.set(item);
        this.editorData = {...item};
    }

    public onEditorChange() {
        this.editForm().value.update(v => {
            eachObject(this.editorData, (val, k) => {
                v[k] = val;
            });
            if (!v.children && v.type == 99) {
                v.children = [];
            }
            return v;
        });
    }

    public tapClear() {
        this.menuItems = [];
        this.editForm().value.set(null);
    }

    public tapRemoveItem() {
        const current = this.editForm().value();
        if (!current) {
            return;
        }
        this.toastrService.confirm('确定删除此菜单项？', () => {
            for (let i = 0; i < this.menuItems.length; i++) {
                const element = this.menuItems[i];
                if (element === current) {
                    this.menuItems.splice(i, 1);
                    this.editForm().value.set(null);
                    return;
                }
                if (!element.children) {
                    continue;
                }
                for (let j = 0; j < element.children.length; j++) {
                    const it = element.children[j];
                    if (it === current) {
                        element.children.splice(i, 1);
                        this.editForm().value.set(null);
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
