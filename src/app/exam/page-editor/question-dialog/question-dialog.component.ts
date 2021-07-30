import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomDialogEvent } from '../../../dialog';
import { DialogAnimation } from '../../../theme/constants';
import { cloneObject } from '../../../theme/utils';
import { emptyValidate } from '../../../theme/validators';
import { IQuestion, IQuestionAnalysis, QuestionDefaultOption } from '../../model';
import { questionNeedOption } from '../../util';

@Component({
    selector: 'app-question-dialog',
    templateUrl: './question-dialog.component.html',
    styleUrls: ['./question-dialog.component.scss'],
    animations: [
        DialogAnimation,
    ],
})
export class QuestionDialogComponent implements CustomDialogEvent {

    public visible = false;
    public typeItems = ['单选题', '多选题', '判断题', '简答题', '填空题'];
    public typeOpen = false;
    public analysisOpen = false;
    public extendOpen = false;
    public analysisData: IQuestionAnalysis = {
        type: 0,
        content: '',
    };
    @Input() public value: IQuestion = {} as any;
    public optionItems: any[] = cloneObject(QuestionDefaultOption);
    @Output() public valueChange = new EventEmitter<IQuestion>();
    private actionFn: any;

    constructor() { }

    public tapType(i: number) {
        this.typeOpen = false;
        this.value.type = i;
        this.onTypeChange();
    }

    public onExtendChange() {
        this.onTypeChange();
    }

    private onTypeChange() {
        if (this.value.type != 4) {
            return;
        }
        const content = this.value.content;
        const matches = content.match(/_{3,}/g);
        if (!matches || matches.length < 1) {
            return;
        }
        const items = this.optionItems.filter(i => i.is_right);
        if (items.length < 1) {
            this.optionItems = [];
        }
        let diff = matches.length - this.optionItems.length;
        if (diff < 1) {
            return;
        }
        this.optionItems.forEach(i => {
            i.is_right = true;
        })
        for (; diff > 0; diff--) {
            this.optionItems.push({
                content: '答案' + diff,
                is_right: true,
            });
        }
    }

    public close(result?: any) {
        if (!result) {
            this.visible = false;
            return;
        }
        this.valueChange.emit(this.value);
        if (!this.actionFn) {
            this.visible = false;
            return;
        }
        this.actionFn();
    }

    public open<T>(data: T, confirm: (data: T) => void, check?: (data: T) => boolean) {
        this.value = data as any;
        this.analysisData = this.value.analysis_items && this.value.analysis_items.length > 0 ? this.value.analysis_items[0] : {type: 0, content: ''};
        if (questionNeedOption(this.value)) {
            this.optionItems = this.value.option_items || cloneObject(QuestionDefaultOption);
        }
        this.analysisOpen = false;
        this.extendOpen = false;
        this.typeOpen = false;
        this.visible = true;
        this.actionFn = () => {
            if (questionNeedOption(this.value)) {
                this.value.option_items = this.optionItems;
            }
            this.value.analysis_items = emptyValidate(this.analysisData.content) ? [] : [{...this.analysisData}];
            if (check && !check(this.value as any)) {
                return;
            }
            confirm(this.value as any);
            this.visible = false;
        };
    }
}
