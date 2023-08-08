import { Component, Input } from '@angular/core';
import { DialogAnimation } from '../../../../../theme/constants';
import { emptyValidate } from '../../../../../theme/validators';
import { ICateringStaffRole } from '../../../model';

type DialogConfirmFn = (value: ICateringStaffRole) => void;

interface IRoleGroup {
    name: string;
    checked?: boolean;
    items: {
        name: string;
        value: string|number;
        checked?: boolean;
    }[];
}

@Component({
    selector: 'app-catering-role-dialog',
    templateUrl: './role-dialog.component.html',
    styleUrls: ['./role-dialog.component.scss'],
    animations: [
        DialogAnimation,
    ],
})
export class RoleDialogComponent {

    /**
     * 是否显示
     */
    @Input() public visible = false;
    public data: ICateringStaffRole = {name: ''} as any;
    public isChecked = false;
    public items: IRoleGroup[] = [
        {
            name: '订单管理',
            items: [
                {name: '编辑订单', value: 'order_edit'},
                {name: '取消订单', value: 'order_cancel'},
                {name: '订单付款', value: 'order_pay'},
            ]
        },
        {
            name: '库存管理',
            items: [
                {name: '管理采购单', value: 'stock_order'},
                {name: '调整库存', value: 'stock_edit'},
            ]
        },
        {
            name: '会员管理',
            items: [
                {name: '管理会员', value: 'patron_edit'},
                {name: '分组管理', value: 'patron_group'},
            ]
        },
    ];
    private confirmFn: DialogConfirmFn;

    constructor() { }

    public open(confirm: DialogConfirmFn): void;
    public open(data: ICateringStaffRole, confirm: DialogConfirmFn): void;
    public open(data: ICateringStaffRole|DialogConfirmFn, confirm?: DialogConfirmFn) {
        if (typeof data === 'function') {
            this.confirmFn = data;
        } else if (data) {
            this.data = data;
            this.applyRole(data.action);
            this.confirmFn = confirm;
        }
        this.visible = true;
    }

    public close(yes = false) {
        if (yes && emptyValidate(this.data.name)) {
            return;
        }
        this.visible = false;
        if (yes && this.confirmFn) {
            this.data.action = this.formatRole();
            this.confirmFn(this.data);
        }
    }

    public toggleCheck(item?: IRoleGroup, kid?: any) {
        if (!item) {
            this.isChecked = !this.isChecked;
            this.items.forEach(i => {
                i.items.forEach(j => {
                    j.checked = this.isChecked;
                });
                i.checked = this.isChecked;
            });
            return;
        }
        if (!kid) {
            item.checked = !item.checked;
            item.items.forEach(j => {
                j.checked = item.checked;
            });
        } else {
            kid.checked = !kid.checked;
            item.checked = this.isCheckedAll(item.items);
        }
        this.isChecked = this.isCheckedAll(this.items);
    }

    private formatRole() {
        const items = [];
        for (const item of this.items) {
            for (const it of item.items) {
                if (it.checked) {
                    items.push(it.value);
                }
            }
        }
        return items.join(',');
    }

    private applyRole(role: string|string[]) {
        if (!role) {
            role = [];
        } else if (typeof role !== 'object') {
            role = role.split(',');
        }
        this.items = this.items.map(item => {
            const items = item.items.map(i => {
                i.checked = role.indexOf(i.value.toString()) >= 0;
                return i;
            });
            return {...item, items, checked: this.isCheckedAll(items)};
        });
        this.isChecked = this.isCheckedAll(this.items);
    }

    private isCheckedAll(items: any[]): boolean {
        for (const item of items) {
            if (!item.checked) {
                return false;
            }
        }
        return true;
    }

}
