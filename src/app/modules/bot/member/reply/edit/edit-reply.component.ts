import { Component, effect, input, output } from '@angular/core';
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

    public readonly value = input<IBotReply>(undefined);
    public editorData: any;
    public eventItems: IItem[] = EventItems;
    public typeItems: IItem[] = EditorTypeItems;
    public readonly valueChange = output<IBotReply>();

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
        eachObject(this.editorData, (v, k) => {
            this.value()[k] = v;
        });
        this.onValueChange();
    }

    public onValueChange() {
        this.valueChange.emit(this.value());
    }

}
