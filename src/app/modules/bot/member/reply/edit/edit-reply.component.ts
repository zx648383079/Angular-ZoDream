import { Component, effect, input, model, output } from '@angular/core';
import { IItem } from '../../../../../theme/models/seo';
import { eachObject } from '../../../../../theme/utils';
import { EditorTypeItems, EventItems, IBotReply } from '../../../model';

@Component({
    standalone: false,
    selector: 'app-edit-reply',
    templateUrl: './edit-reply.component.html',
    styleUrls: ['./edit-reply.component.scss']
})
export class EditReplyComponent {

    public readonly value = model<IBotReply>();
    public editorData: any;
    public eventItems: IItem[] = EventItems;
    public typeItems: IItem[] = EditorTypeItems;

    constructor() {
        effect(() => {
            this.editorData = {...this.value()};
            const value = this.value();
            if (value && !value.event) {
                value.event = this.eventItems[0].value as string;
            }
        });
    }

    public onEditorChange() {
        this.value.update(v => {
            eachObject(this.editorData, (v, k) => {
                v[k] = v;
            });
            return v;
        });
        
    }

    public onEventChange(e: Event) {
        this.value.update(v => {
            v.event = (e.target as HTMLSelectElement).value;
            return v;
        });
    }

    public onMatchChange(val: any) {
        this.value.update(v => {
            v.match = val;
            return v;
        });
    }
    public onKeywordsChange(e: any) {
        this.value.update(v => {
            v.keywords = typeof e == 'string' ? e : (e.target as HTMLSelectElement).value;
            return v;
        });
    }

}
