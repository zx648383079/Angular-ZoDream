import { Component, model } from '@angular/core';
import { IQuestion, IQuestionAnalysis } from '../../../model';

@Component({
    standalone: false,
    selector: 'app-question-min',
    templateUrl: './question-min.component.html',
    styleUrls: ['./question-min.component.scss']
})
export class QuestionMinComponent {

    public readonly value = model<IQuestion>({} as any);
    public typeItems = ['单选题', '多选题', '判断题', '简答题', '填空题'];
    public optionTypeItems = ['文字', '图片'];

    public onTypeChange() {
        const value = this.value();
        if (value.type != 4) {
            return;
        }
        const matches = value.title.match(/_{3,}/g);
        if (!matches || matches.length < 1) {
            return;
        }
        let diff = matches.length - value.option_items.length;
        if (diff < 1) {
            return;
        }
        for (; diff > 0; diff--) {
            this.tapAddItem();
        }
    }

    public tapAddItem() {
        this.value.update(v => {
            v.option_items.push({
                content: '',
                type: 0,
                is_right: 0,
            } as any);
            return v;
        });
    }

    public tapRemoveItem(i: number) {
        this.value.update(v => {
            v.option_items.splice(i, 1);
            return v;
        });
    }

    public onAnalysisChange(items: IQuestionAnalysis[]) {
        this.value.update(v => {
            v.analysis_items = items;
            return {...v};
        });
    }
}
