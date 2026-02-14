import { Component, effect, input, model } from '@angular/core';
import { IQuestionFormat, IQuestionOption } from '../../model';
import { FormValueControl } from '@angular/forms/signals';
import { ArraySource } from '../../../../components/form';

/**
 * 题目选择
 */
@Component({
    standalone: false,
    selector: 'app-question-input',
    templateUrl: './question-input.component.html',
    styleUrls: ['./question-input.component.scss']
})
export class QuestionInputComponent implements FormValueControl<IQuestionFormat> {

    public readonly value = model<IQuestionFormat>();
    public readonly disabled = input(false);
    public readonly choiceItems = ArraySource.fromOrder('错', '对');

    constructor() {
        effect(() => {
            this.value();
            this.formatOption();
        });
    }

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

    public tapCheckItem(item: IQuestionOption) {
        const value = this.value();
        if (!value || this.disabled()) {
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
        this.value.set(data);
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
        if (!this.disabled()) {
            this.value.update(v => {
                if (v) {
                    v.answer = value;
                }
                return {...v};
            });
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
