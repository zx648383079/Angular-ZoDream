import { Component, model } from '@angular/core';
import { CustomDialogEvent } from '../../../../../components/dialog';
import { cloneObject } from '../../../../../theme/utils';
import { emptyValidate } from '../../../../../theme/validators';
import { IQuestion, IQuestionAnalysis, QuestionCheckOption, QuestionDefaultOption } from '../../../model';
import { formatFillOption, questionNeedOption, questionOptionIsEmpty } from '../../../util';

@Component({
    standalone: false,
    selector: 'app-question-dialog',
    templateUrl: './question-dialog.component.html',
    styleUrls: ['./question-dialog.component.scss'],
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
    public readonly value = model<IQuestion>({} as any);
    public optionItems: any[] = cloneObject(QuestionDefaultOption);
    private actionFn: any;

    public tapType(i: number) {
        this.typeOpen = false;
        this.value().type = i;
        if (i === 2 && questionOptionIsEmpty(this.optionItems)) {
            this.optionItems = cloneObject(QuestionCheckOption);
        }
        this.onTypeChange();
    }

    public onExtendChange() {
        this.onTypeChange();
    }

    private onTypeChange() {
        const value = this.value();
        if (value.type != 4) {
            return;
        }
        this.optionItems = formatFillOption(value.content, this.optionItems);
    }

    public close(result?: any) {
        if (!result) {
            this.visible = false;
            return;
        }
        if (!this.actionFn) {
            this.visible = false;
            return;
        }
        this.actionFn();
    }

    public open<T>(data: T, confirm: (data: T) => void, check?: (data: T) => boolean) {
        this.value.set(data as any);
        const value = this.value();
        this.analysisData = value.analysis_items && value.analysis_items.length > 0 ? value.analysis_items[0] : {type: 0, content: ''};
        const valueValue = this.value();
        if (questionNeedOption(valueValue)) {
            this.optionItems = valueValue.option_items || cloneObject(QuestionDefaultOption);
        }
        this.analysisOpen = false;
        this.extendOpen = false;
        this.typeOpen = false;
        this.visible = true;
        this.actionFn = () => {
            const valueVal = this.value();
            if (questionNeedOption(valueVal)) {
                valueVal.option_items = this.optionItems;
            }
            valueVal.analysis_items = emptyValidate(this.analysisData.content) ? [] : [{...this.analysisData}];
            if (check && !check(valueVal as any)) {
                return;
            }
            confirm(valueVal as any);
            this.visible = false;
        };
    }
}
