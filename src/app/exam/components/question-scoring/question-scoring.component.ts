import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogEvent } from '../../../dialog';
import { IQuestionFormat, IQuestionOption } from '../../model';

/**
 * 题目评分
 */
@Component({
  selector: 'app-question-scoring',
  templateUrl: './question-scoring.component.html',
  styleUrls: ['./question-scoring.component.scss']
})
export class QuestionScoringComponent {

    @Input() public value: IQuestionFormat;
    @Output() public valueChange = new EventEmitter<IQuestionFormat>();

    public editData = {
        score: 0,
        remark: '',
    };

    constructor() { }

    public get yourAnswer() {
        if (this.value.your_answer) {
            return this.value.your_answer;
        }
        if (this.value.log) {
            return this.value.log.answer;
        }
        return '';
    }

    public optionChecked(option: IQuestionOption) {
        if (!this.value) {
            return false;
        }
        if (this.value.type < 1) {
            return this.yourAnswer == option.id;
        }
        return typeof this.yourAnswer === 'object' && this.yourAnswer.indeOf(option.id) >= 0;
    }

    public tapEdit(modal: DialogEvent) {
        if (!this.value.log) {
            this.value.log = {} as any;
        }
        this.editData = {
            score: this.value.log.score || 0,
            remark: this.value.log.remark || '',
        }
        modal.open(() => {
            this.value.log.score = this.editData.score;
            this.value.log.remark = this.editData.remark;
            this.valueChange.emit(this.value);
        });
    }

}
