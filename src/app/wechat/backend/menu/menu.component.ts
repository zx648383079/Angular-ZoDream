import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../dialog';
import { WechatService } from '../wechat.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

    public menuItems: any = [];
    public editData: any;

    constructor(
        private service: WechatService,
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
    }

    public tapClear() {
        this.menuItems = [];
        this.editData = undefined;
    }

    public tapRemoveItem() {
        
    }

    public tapSubmit() {
        this.service.menuBatchSave(this.menuItems).subscribe({
            next: _ => {
                this.toastrService.success('保存成功');
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

}
