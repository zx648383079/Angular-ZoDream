import { Component, model } from '@angular/core';
import { DialogEvent } from '../../../../components/dialog';
import { IQuestionFormat, IQuestionOption } from '../../model';

/**
 * 题目评分
 */
@Component({
    standalone: false,
    selector: 'app-question-scoring',
    templateUrl: './question-scoring.component.html',
    styleUrls: ['./question-scoring.component.scss']
})
export class QuestionScoringComponent {

    public readonly value = model<IQuestionFormat>();

    public editData = {
        score: 0,
        remark: '',
    };

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

    public tapEdit(modal: DialogEvent) {
        const value = this.value();
        if (!value.log) {
            value.log = {} as any;
        }
        this.editData = {
            score: value.log.score || 0,
            remark: value.log.remark || '',
        }
        modal.open(() => {
            this.value.update(v => {
                v.log.score = this.editData.score;
                v.log.remark = this.editData.remark;
                return v;
            });
        });
    }

}
