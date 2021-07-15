import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IQuestionFormat, IQuestionOption } from '../../model';

@Component({
    selector: 'app-question-input',
    templateUrl: './question-input.component.html',
    styleUrls: ['./question-input.component.scss']
})
export class QuestionInputComponent {

    @Input() public value: IQuestionFormat;
    @Input() public editable = true;
    @Output() public valueChange = new EventEmitter<IQuestionFormat>();

    constructor() { }

    public tapCheckItem(item: IQuestionOption) {
        if (!this.value || !this.editable) {
            return;
        }
        const data = this.value;
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
        if (!this.value) {
            return false;
        }
        if (this.value.type < 1) {
            return this.value.your_answer == option.id;
        }
        return typeof this.value.your_answer === 'object' && this.value.your_answer.indeOf(option.id) >= 0;
    }

    public onAnswerChange(value?: any) {
        if (this.editable) {
            if (value) {
                this.value.answer = value;
            }
            this.valueChange.emit(this.value);
        }
    }
}
