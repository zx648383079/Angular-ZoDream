import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IItem } from '../../../../../theme/models/seo';
import { eachObject } from '../../../../../theme/utils';
import { EditorTypeItems, EventItems, IBotReply } from '../../../model';

@Component({
  selector: 'app-edit-reply',
  templateUrl: './edit-reply.component.html',
  styleUrls: ['./edit-reply.component.scss']
})
export class EditReplyComponent implements OnChanges {

    @Input() public value: IBotReply;
    public editorData: any;
    public eventItems: IItem[] = EventItems;
    public typeItems: IItem[] = EditorTypeItems;
    @Output() public valueChange = new EventEmitter<IBotReply>();

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.value) {
            this.editorData = {...changes.value.currentValue};
            if (this.value && !this.value.event) {
                this.value.event = this.eventItems[0].value as string;
            }
        }
    }

    public onEditorChange() {
        eachObject(this.editorData, (v, k) => {
            this.value[k] = v;
        });
        this.onValueChange();
    }

    public onValueChange() {
        this.valueChange.emit(this.value);
    }

}
