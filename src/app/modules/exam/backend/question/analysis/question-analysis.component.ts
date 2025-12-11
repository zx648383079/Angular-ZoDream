import { Component, model } from '@angular/core';
import { DialogEvent } from '../../../../../components/dialog';
import { emptyValidate } from '../../../../../theme/validators';
import { IQuestionAnalysis } from '../../../model';

@Component({
    standalone: false,
    selector: 'app-question-analysis',
    templateUrl: './question-analysis.component.html',
    styleUrls: ['./question-analysis.component.scss']
})
export class QuestionAnalysisComponent {

    public readonly value = model<IQuestionAnalysis[]>([]);
    public analysisTypeItems = ['文本', '音频', '视频'];
    public analysisData: IQuestionAnalysis = {
        type: 0,
        content: '',
    };

    constructor() { }


    public tapEdit(modal: DialogEvent, i = -1) {
        const val = this.value()[i];
        this.analysisData.type = i >= 0 ? val.type : 0;
        this.analysisData.content = i >= 0 ? val.content : '';
        modal.open(() => {
            this.value.update(v => {
                if (i >= 0) {
                    v[i].type = this.analysisData.type;
                    v[i].content = this.analysisData.content;
                } else {
                    v.push({...this.analysisData});
                }
                return v;
            });
            
        }, () => !emptyValidate(this.analysisData.content), i >= 0 ? '编辑解析' : '新增解析');
    }

    public tapRemove(i: number) {
        this.value.update(v => {
            v.splice(i, 1);
            return v;
        });
    }
}
