import { Component, OnInit } from '@angular/core';
import { IItem } from '../../../../theme/models/seo';

@Component({
  selector: 'app-edit-reply',
  templateUrl: './edit-reply.component.html',
  styleUrls: ['./edit-reply.component.scss']
})
export class EditReplyComponent implements OnInit {

    public eventItems: IItem[] = [
        {name: '默认回复', value: 'default'},
        {name: '消息', value: 'message'},
        {name: '关注', value: 'subscribe'},
        {name: '菜单事件', value: 'CLICK'},
    ];
    public typeItems: IItem[] = [
        {name: '文本', value: 0},
        {name: '媒体素材', value: 1},
        {name: '图文', value: 2},
        {name: '模板消息', value: 3},
        {name: '事件', value: 4},
        {name: '网址', value: 5},
        {name: '小程序', value: 6},
        {name: '场景', value: 7},
    ];

    constructor() { }

    ngOnInit() {
    }

}
