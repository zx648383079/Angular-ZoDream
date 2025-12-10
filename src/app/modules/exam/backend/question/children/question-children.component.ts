import { Component, input, output as output_1 } from '@angular/core';
import { IQuestion } from '../../../model';

@Component({
    standalone: false,
  selector: 'app-question-children',
  templateUrl: './question-children.component.html',
  styleUrls: ['./question-children.component.scss']
})
export class QuestionChildrenComponent {

    public readonly value = input<IQuestion[]>([]);
    public readonly valueChange = output<IQuestion[]>();

    constructor() { }

    public tapAdd() {
        this.value().push({
            type: 0,
            title: '',
            answer: '',
            analysis_items: [],
            option_items: [],
        } as any);
        this.output();
    }

    public tapEdit(item: IQuestion, i: number) {
        this.value()[i] = item;
        this.output();
    }

    public tapRemove(i: number) {
        this.value().splice(i, 1);
        this.output();
    }

    public onValueChange() {
        this.output();
    }

    private output() {
        this.valueChange.emit(this.value());
    }
}
