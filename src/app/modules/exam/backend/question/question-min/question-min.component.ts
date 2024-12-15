import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IQuestion } from '../../../model';

@Component({
    standalone: false,
  selector: 'app-question-min',
  templateUrl: './question-min.component.html',
  styleUrls: ['./question-min.component.scss']
})
export class QuestionMinComponent {

    @Input() public value: IQuestion = {} as any;
    @Output() public valueChange = new EventEmitter<IQuestion>();
    public typeItems = ['单选题', '多选题', '判断题', '简答题', '填空题'];
    public optionTypeItems = ['文字', '图片'];

    constructor() { }

    public onTypeChange() {
        if (this.value.type != 4) {
            return;
        }
        const matches = this.value.title.match(/_{3,}/g);
        if (!matches || matches.length < 1) {
            return;
        }
        let diff = matches.length - this.value.option_items.length;
        if (diff < 1) {
            return;
        }
        for (; diff > 0; diff--) {
            this.tapAddItem();
        }
    }

    public onValueChange() {
        this.valueChange.emit(this.value);
    }

    public tapAddItem() {
        this.value.option_items.push({
            content: '',
            type: 0,
            is_right: 0,
        } as any);
        this.onValueChange();
    }

    public tapRemoveItem(i: number) {
        this.value.option_items.splice(i, 1);
        this.onValueChange();
    }
}
