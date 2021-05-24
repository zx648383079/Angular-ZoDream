import { Component, Input } from '@angular/core';
import { IItem } from '../../../theme/models/seo';

@Component({
  selector: 'app-message-editor',
  templateUrl: './message-editor.component.html',
  styleUrls: ['./message-editor.component.scss']
})
export class MessageEditorComponent {

    @Input() public value = {
        type: 0,
    };

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
    public sceneItems: IItem[] = [];

    constructor() { }

}
