import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IItem } from '../../../theme/models/seo';
import { parseNumber } from '../../../theme/utils';
import { WechatService } from '../wechat.service';

interface IEditorData {
    type: number;
    text?: string;
    media?: number;
    template_id?: number;
    template_url?: string;
    parameters?: string;
    parameter?: string;
    url?: string;
    appid?: string;
    path?: string;
    scene?: string;
}

@Component({
  selector: 'app-message-editor',
  templateUrl: './message-editor.component.html',
  styleUrls: ['./message-editor.component.scss']
})
export class MessageEditorComponent implements OnChanges {

    @Input() public other = '';
    @Input() public value: any = {
        type: 0,
    };
    public data: IEditorData = {
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
    @Output() public valueChange = new EventEmitter<any>();

    constructor(
        private service: WechatService,
    ) {
        this.service.batch({scenes: {}}).subscribe(res => {
            this.sceneItems = res.scenes;
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.value) {
            this.data = this.parseData(changes.value.currentValue);
        }
    }

    public onTypeChange() {

        this.valueChange.emit(this.value = this.renderData(this.data));
    }

    public onContentChange() {
        this.valueChange.emit(this.value = this.renderData(this.data));
    }


    private parseData(value: any): IEditorData {
        const data: IEditorData = {
            type: parseNumber(value.type),
        };
        const getVal = (key: string) => {
            if (typeof value.content === 'string') {
                value.content = JSON.parse(value.content);
            }
            if (!value.content) {
                return '';
            }
            return value.content[key] || '';
        };
        switch (data.type) {
            case 0:
                data.text = value.content;
                break;
            case 1:
            case 2:
                data.media = value.content;
                break;
            case 3:
                data.template_id = getVal('template_id');
                data.template_url = getVal('template_url');
                data.parameters = getVal('template_data');
                break;
            case 4:
                data.parameter = value.content;
                break;
            case 5:
                data.url = value.content;
                break;
            case 6:
                data.appid = getVal('appid');
                data.path = getVal('path');
                data.url = getVal('url');
                break;
            case 7:
                data.scene = value.content;
                break;
            default:
                break;
        }
        return data;
    }

    private renderData(data: IEditorData): any {
        const res: any = {
            type: data.type,
        };
        switch (data.type) {
            case 0:
                res.content = data.text;
                break;
            case 1:
            case 2:
            res.content = data.media;
                break;
            case 3:
                res.content = {
                    template_id: data.template_id,
                    template_url: data.template_url,
                    template_data: data.parameters
                };
                break;
            case 4:
                res.content = data.parameter;
                break;
            case 5:
                res.content = data.url;
                break;
            case 6:
                res.content = {
                    appid: data.appid,
                    path: data.path,
                    url: data.url
                };
                break;
            case 7:
                res.content = data.scene;
                break;
            default:
                break;
        }
        return res;
    }
}
