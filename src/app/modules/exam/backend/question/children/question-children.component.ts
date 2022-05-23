import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IQuestion } from '../../../model';

@Component({
  selector: 'app-question-children',
  templateUrl: './question-children.component.html',
  styleUrls: ['./question-children.component.scss']
})
export class QuestionChildrenComponent {

    @Input() public value: IQuestion[] = [];
    @Output() public valueChange = new EventEmitter<IQuestion[]>();

    constructor() { }

    public tapAdd() {
        this.value.push({
            type: 0,
            title: '',
            answer: '',
            analysis_items: [],
            option_items: [],
        } as any);
        this.output();
    }

    public tapEdit(item: IQuestion, i: number) {
        this.value[i] = item;
        this.output();
    }

    public tapRemove(i: number) {
        this.value.splice(i, 1);
        this.output();
    }

    public onValueChange() {
        this.output();
    }

    private output() {
        this.valueChange.emit(this.value);
    }
}
