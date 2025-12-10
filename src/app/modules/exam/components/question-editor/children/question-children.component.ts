import { Component, input, output } from '@angular/core';
import { CustomDialogEvent } from '../../../../../components/dialog';
import { IQuestion } from '../../../model';

@Component({
    standalone: false,
  selector: 'app-question-children',
  templateUrl: './question-children.component.html',
  styleUrls: ['./question-children.component.scss']
})
export class QuestionChildrenComponent {
    public readonly value = input<IQuestion[]>([]);
    public readonly editable = input(true);
    public readonly valueChange = output<IQuestion[]>();
    public editData: IQuestion = {
    } as any;

    constructor() { }

    public tapEdit(modal: CustomDialogEvent, i = -1) {
        modal.open<IQuestion>(i >= 0 ? this.value()[i] : {} as any,  data => {
            const value = this.value();
            if (i >=0) {
                value[i] = data;
            } else {
                value.push(data);
            }
            this.valueChange.emit(value);
        });
    }

    public tapRemove(event: MouseEvent, i: number) {
        event.stopPropagation();
        if (!this.editable()) {
            return;
        }
        this.value().splice(i, 1);
        this.valueChange.emit(this.value());
    }

}
