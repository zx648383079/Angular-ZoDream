import { Component, OnChanges, OnInit, SimpleChanges, input, output } from '@angular/core';
import { IQuestionFormat, IQuestionOption } from '../../model';

/**
 * 题目选择
 */
@Component({
    standalone: false,
  selector: 'app-question-input',
  templateUrl: './question-input.component.html',
  styleUrls: ['./question-input.component.scss']
})
export class QuestionInputComponent implements OnChanges {

    public readonly value = input<IQuestionFormat>(undefined);
    public readonly editable = input(true);
    public readonly valueChange = output<IQuestionFormat>();

    constructor() { }

    public get yourAnswer() {
        const value = this.value();
        if (value.your_answer) {
            return value.your_answer;
        }
        if (value.log) {
            return value.log.answer;
        }
        return '';
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.value) {
            this.formatOption();
        }
    }

    public tapCheckItem(item: IQuestionOption) {
        const value = this.value();
        if (!value || !this.editable()) {
            return;
        }
        const data = value;
        for (const option of data.option) {
            if (option.id === item.id) {
                option.checked = data.type === 1 ? !option.checked : true;
                continue;
            }
            if (data.type === 1) {
                continue;
            }
            option.checked = false;
        }
        data.answer = data.type < 1 ? item.id : data.option.map(i => i.id);
        this.valueChange.emit(this.value = data);
    }

    public optionChecked(option: IQuestionOption) {
        const value = this.value();
        if (!value) {
            return false;
        }
        if (value.type < 1) {
            return this.yourAnswer == option.id;
        }
        return typeof this.yourAnswer === 'object' && this.yourAnswer.indeOf(option.id) >= 0;
    }

    public onAnswerChange(value?: any) {
        if (this.editable()) {
            const valueValue = this.value();
            if (value) {
                valueValue.answer = value;
            }
            this.valueChange.emit(valueValue);
        }
    }

    private formatOption() {
        if (this.value().type > 1 || !this.yourAnswer) {
            return;
        }
        this.value().option.forEach(i => {
            i.checked = this.optionChecked(i);
        });
    }

}
