import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IPage } from '../../../../theme/models/page';
import { IItem } from '../../../../theme/models/seo';
import { mapFormat, parseNumber } from '../../../../theme/utils';
import { EditorTypeItems, IWeChatMedia, IWeChatReplyTemplate, IWeChatReplyTemplateField, MediaTypeItems, MenuTypeItems } from '../../model';
import { formatTemplateField } from '../../util';
import { WechatService } from '../wechat.service';

interface IEditorData {
    type: number;
    text?: string;
    media?: number;
    template_id?: string;
    template_url?: string;
    parameters?: IWeChatReplyTemplateField[];
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
    @Input() public source = 0;
    @Input() public value: any = {
        type: 0,
    };
    public data: IEditorData = {
        type: 0,
    };

    public typeItems: IItem[] = [...EditorTypeItems];
    public sceneItems: IItem[] = [];
    public requestUrl = 'wx/admin/media/search';
    @Output() public valueChange = new EventEmitter<any>();
    private template: IWeChatReplyTemplate;

    constructor(
        private service: WechatService,
    ) {
        this.requestUrl += '?wid=' + this.service.baseId;
        this.service.batch({scenes: {}}).subscribe(res => {
            this.sceneItems = res.scenes;
        });
    }

    
    public formatFn = (res: IPage<IWeChatMedia>): IWeChatMedia[] => {
        return res.data.map(i => {
            const tag = mapFormat(i.type, MediaTypeItems);
            i.title = `[${tag}]${i.title}`;
            return i;
        });
    };

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.source) {
            this.typeItems = changes.source.currentValue > 0 ? [...MenuTypeItems] : [...EditorTypeItems]
        }
        if (changes.value) {
            this.data = this.parseData(changes.value.currentValue);
        }
    }


    public onTypeChange() {
        if (this.data.type == 3) {
            this.data.parameters = [];
        }
        this.onContentChange();
    }

    public onContentChange() {
        this.valueChange.emit(this.value = this.renderData(this.data));
    }

    public onTemplateChange() {
        if (this.template && this.template.template_id === this.data.template_id) {
            this.data.parameters = formatTemplateField(this.template.content);
            this.onContentChange();
            return;
        }
        this.service.wxTemplate(this.data.template_id).subscribe({
            next: res => {
                this.template = res;
                this.data.parameters = formatTemplateField(res.content);
                this.onContentChange();
            },
            error: err => {
                // TODO 模板不存在请先添加
            }
        });
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
                data.appid = getVal('appid');
                data.path = getVal('path');
                let p = getVal('template_data');
                if (typeof p === 'string') {
                    if (p.indexOf('{') < 0) {
                        p = p.split('\n').map(i => {
                            let [name, value] = i.split('=');
                            return {name, value}
                        });
                    } else {
                        p = JSON.parse(p);
                    }
                }
                data.parameters = p;
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
                    appid: data.appid,
                    path: data.path,
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
