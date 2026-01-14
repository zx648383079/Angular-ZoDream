import { Component, input, model, signal } from '@angular/core';
import { CustomDialogEvent } from '../../../../../components/dialog';
import { IQuestion } from '../../../model';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-question-children',
    templateUrl: './question-children.component.html',
    styleUrls: ['./question-children.component.scss']
})
export class QuestionChildrenComponent {
    public readonly value = model<IQuestion[]>([]);
    public readonly disabled = input(false);
    public readonly editForm = form(signal<IQuestion>({

    } as any));

    public tapEdit(modal: CustomDialogEvent, i = -1) {
        modal.open<IQuestion>(i >= 0 ? this.value()[i] : {} as any,  data => {
            this.value.update(v => {
                if (i >=0) {
                    v[i] = data;
                } else {
                    v.push(data);
                }
                return v;
            });
        });
    }

    public tapRemove(event: MouseEvent, i: number) {
        event.stopPropagation();
        if (this.disabled()) {
            return;
        }
        this.value.update(v => {
            v.splice(i, 1);
            return [...v];
        });
        
    }

}
