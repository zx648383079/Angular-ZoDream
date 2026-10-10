import { Component, effect, inject, input, model, signal } from '@angular/core';
import { IItem } from '../../../../theme/models/seo';
import { EditorTypeItems, IBotReplyTemplate, MenuTypeItems } from '../../model';
import { BotService, IEditorFormatted } from '../bot.service';
import { FormValueControl } from '@angular/forms/signals';
import { parseNumber } from '../../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-bot-message-editor',
    templateUrl: './message-editor.component.html',
    styleUrls: ['./message-editor.component.scss']
})
export class MessageEditorComponent implements FormValueControl<IEditorFormatted> {
    private readonly service = inject(BotService);

    public readonly other = input('');
    public readonly source = input(0);
    public readonly value = model<IEditorFormatted>(this.service.parseEditor());

    public readonly typeItems = signal<IItem[]>([...EditorTypeItems]);
    public readonly sceneItems = signal<IItem[]>([]);
    private template?: IBotReplyTemplate;

    public readonly mediaSource = this.service.mediaSource();

    constructor() {
        this.service.batch({scenes: {}}).subscribe(res => {
            this.sceneItems.set(res.scenes);
        });
        effect(() => {
            this.typeItems.set(this.source() > 0 ? [...MenuTypeItems] : [...EditorTypeItems]);
        });
    }


    public onTypeChange(e: Event) {
        this.onValChange('type', parseNumber((e.target as HTMLSelectElement).value));
    }

    public onTextChange(e: Event, key: string) {
        this.onValChange(key, (e.target as HTMLInputElement).value);
    }

    public onValChange(key: string, val: any) {
        this.value.update(v => {
            return {...v, [key]: val};
        });
    }

    public onTemplateChange(e: Event) {
        const template_id = (e.target as HTMLInputElement).value;
        if (this.template && this.template.template_id === template_id) {
            this.value.update(v => {
                return {...v, template_id, parameters: this.service.formatTemplateField(this.template!.content)}
            });
            return;
        }
        this.service.wxTemplate(template_id).subscribe({
            next: res => {
                this.template = res;
                this.value.update(v => {
                    return {...v, template_id, parameters: this.service.formatTemplateField(res.content)}
                });
            },
            error: err => {
                // TODO 模板不存在请先添加
            }
        });
    }

    public onFlowChange(index: number, key: string, e: Event) {
        this.value.update(v => {
            (v.parameters[index] as any)[key] = (e.target as HTMLInputElement).value;
            return {...v};
        });
    }


    
}
