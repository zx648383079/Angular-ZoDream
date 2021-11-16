import { Component, Input, OnInit } from '@angular/core';
import { DialogConfirmFn } from '../../dialog';
import { ButtonEvent } from '../../form';
import { DialogAnimation } from '../../theme/constants';
import { IItem } from '../../theme/models/seo';
import { IWebPage } from '../model';

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
            {name: '色情低俗', value: 0},  
            {name: '涉嫌违法犯罪', value: 0},  
            {name: '赌博博彩', value: 0},  
            {name: '恐怖暴力', value: 0},  
            {name: '违禁物品', value: 0},  
            {name: '购物交易诈骗', value: 0},
            {name: '钓鱼网站/病毒木马', value: 0},  
            {name: '其他', value: 0},
        ]},
        {label: '知识产权侵权', items:[
            {name: '著作权/版权', value: 0},  
            {name: '专利权', value: 0},
        ]},
    ];
    public typeIndex = 0;
    public content = '';
    public email = '';

    constructor() { }

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
    }

    public close() {
        this.visible = false;
    }

    public tapSubmit(e: ButtonEvent) {

    }

}
