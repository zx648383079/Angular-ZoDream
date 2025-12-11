import { Component, effect, inject, input, model } from '@angular/core';
import { IPage } from '../../../../theme/models/page';
import { IItem } from '../../../../theme/models/seo';
import { mapFormat, parseNumber } from '../../../../theme/utils';
import { EditorTypeItems, IBotMedia, IBotReplyTemplate, IBotReplyTemplateField, MediaTypeItems, MenuTypeItems } from '../../model';
import { formatTemplateField } from '../../util';
import { BotService } from '../bot.service';

interface IEditorData {
    type: number;
    text?: string;
    media?: number;
    template_id?: string;
    template_url?: string;
    parameters?: IBotReplyTemplateField[];
    parameter?: string;
    url?: string;
    appid?: string;
    path?: string;
    scene?: string;
}

@Component({
    standalone: false,
    selector: 'app-bot-message-editor',
    templateUrl: './message-editor.component.html',
    styleUrls: ['./message-editor.component.scss']
})
export class MessageEditorComponent {
    private service = inject(BotService);


    public readonly other = input('');
    public readonly source = input(0);
    public readonly value = model<any>({
        type: 0,
    });
    public data: IEditorData = {
        type: 0,
    };

    public typeItems: IItem[] = [...EditorTypeItems];
    public sceneItems: IItem[] = [];
    public requestUrl = 'wx/admin/media/search';
    private template: IBotReplyTemplate;

    constructor() {
        this.requestUrl += '?wid=' + this.service.baseId;
        this.service.batch({scenes: {}}).subscribe(res => {
            this.sceneItems = res.scenes;
        });
        effect(() => {
            this.typeItems = this.source() > 0 ? [...MenuTypeItems] : [...EditorTypeItems]
        });
        effect(() => {
            this.data = this.parseData(this.value());
        });
    }

    
    public formatFn = (res: IPage<IBotMedia>): IBotMedia[] => {
        return res.data.map(i => {
            const tag = mapFormat(i.type, MediaTypeItems);
            i.title = `[${tag}]${i.title}`;
            return i;
        });
    };


    public onTypeChange() {
        if (this.data.type == 3) {
            this.data.parameters = [];
        }
        this.onContentChange();
    }

    public onContentChange() {
        this.value.set(this.renderData(this.data));
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
