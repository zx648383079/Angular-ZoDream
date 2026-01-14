import { Component, model } from '@angular/core';
import { IQuestion } from '../../../model';

@Component({
    standalone: false,
    selector: 'app-question-children',
    templateUrl: './question-children.component.html',
    styleUrls: ['./question-children.component.scss']
})
export class QuestionChildrenComponent {

    public readonly value = model<IQuestion[]>([]);

    public tapAdd() {
        this.value.update(v => {
            v.push({
                type: 0,
                title: '',
                answer: '',
                analysis_items: [],
                option_items: [],
            } as any);
            return [...v];
        });
    }

    public tapEdit(item: IQuestion, i: number) {
        this.value.update(v => {
            v[i] = item;
            return [...v];
        });
    }

    public tapRemove(i: number) {
        this.value.update(v => {
            v.splice(i, 1);
            return [...v];
        });
    }
}
