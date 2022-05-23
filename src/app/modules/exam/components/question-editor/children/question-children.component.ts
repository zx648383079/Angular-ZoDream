import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomDialogEvent } from '../../../../../components/dialog';
import { IQuestion } from '../../../model';

@Component({
  selector: 'app-question-children',
  templateUrl: './question-children.component.html',
  styleUrls: ['./question-children.component.scss']
})
export class QuestionChildrenComponent {
    @Input() public value: IQuestion[] = [];
    @Input() public editable = true;
    @Output() public valueChange = new EventEmitter<IQuestion[]>();
    public editData: IQuestion = {
    } as any;

    constructor() { }

    public tapEdit(modal: CustomDialogEvent, i = -1) {
        modal.open<IQuestion>(i >= 0 ? this.value[i] : {} as any,  data => {
            if (i >=0) {
                this.value[i] = data;
            } else {
                this.value.push(data);
            }
            this.valueChange.emit(this.value);
        });
    }

    public tapRemove(event: MouseEvent, i: number) {
        event.stopPropagation();
        if (!this.editable) {
            return;
        }
        this.value.splice(i, 1);
        this.valueChange.emit(this.value);
    }

}
