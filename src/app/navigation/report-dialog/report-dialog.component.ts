import { Component, Input, OnInit } from '@angular/core';
import { DialogConfirmFn, DialogService } from '../../dialog';
import { ButtonEvent } from '../../form';
import { DialogAnimation } from '../../theme/constants';
import { IItem } from '../../theme/models/seo';
import { emptyValidate } from '../../theme/validators';
import { IWebPage } from '../model';
import { NavigationService } from '../navigation.service';

@Component({
    selector: 'app-report-dialog',
    templateUrl: './report-dialog.component.html',
    styleUrls: ['./report-dialog.component.scss'],
    animations: [
        DialogAnimation,
    ],
})
export class ReportDialogComponent {

    /**
     * 是否显示
     */
    @Input() public visible = false;
    @Input() public data: IWebPage;
    @Input() public confirmFn: DialogConfirmFn;


    public typeItems: {
        label: string;
        items: IItem[];
    }[] = [
        {label: '违法和不良信息举报', items: [
            {name: '色情低俗', value: 11},  
            {name: '涉嫌违法犯罪', value: 12},  
            {name: '赌博博彩', value: 13},  
            {name: '恐怖暴力', value: 14},  
            {name: '违禁物品', value: 15},  
            {name: '购物交易诈骗', value: 16},
            {name: '钓鱼网站/病毒木马', value: 17},  
            {name: '其他', value: 99},
        ]},
        {label: '知识产权侵权', items:[
            {name: '著作权/版权', value: 20},  
            {name: '专利权', value: 21},
        ]},
    ];
    public typeIndex = 0;
    public content = '';
    public email = '';

    constructor(
        private service: NavigationService,
        private toastrService: DialogService,
    ) { }

    public get typeOptionItems() {
        return this.typeItems[this.typeIndex].items;
    }

    public get wordSize() {
        return Math.max(0, 500 - this.content.length);
    }

    public open(data: IWebPage, cb?: DialogConfirmFn) {
        this.confirmFn = cb;
        this.data = data;
        this.visible = true;
        this.content = '';
    }

    public close() {
        this.visible = false;
    }

    public tapSubmit(e: ButtonEvent) {
        const data = {
            item_type: 31,
            item_id: this.data.id,
            type: 99,
            title: '',
            content: `[${this.data.title}](${this.data.link}):${this.content}`,
            email: this.email
        };
        if (emptyValidate(data.content)) {
            this.toastrService.warning('请输入问题描述');
            return;
        }
        const option = [];
        for (const item of this.typeOptionItems) {
            if (item.checked) {
                data.type = item.value as number;
                option.push(item.name);
            }
        }
        if (option.length < 1) {
            this.toastrService.warning('请选择举报类型');
            return;
        }
        data.title = option.join('、');
        e?.enter();
        this.service.report(data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success('举报成功，等待人工审核');
                this.visible = false;
                this.confirmFn && this.confirmFn();
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }

}
