import { Component, model, signal } from '@angular/core';
import { DialogEvent } from '../../../../../components/dialog';
import { emptyValidate } from '../../../../../theme/validators';
import { IQuestionAnalysis } from '../../../model';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-question-analysis',
    templateUrl: './question-analysis.component.html',
    styleUrls: ['./question-analysis.component.scss']
})
export class QuestionAnalysisComponent {

    public readonly value = model<IQuestionAnalysis[]>([]);
    public analysisTypeItems = ['文本', '音频', '视频'];
    public readonly analysisForm = form(signal({
        type: '0',
        content: '',
    }), schemaPath => {
        required(schemaPath.content);
    });

    public tapEdit(modal: DialogEvent, i = -1) {
        const val = this.value()[i];
        this.analysisForm().value.update(v => {
            v.type = i >= 0 ? val.type as any : '0';
            v.content = i >= 0 ? val.content : '';
            return v;
        });

        modal.open(() => {
            this.value.update(v => {
                const data = this.analysisForm().value() as any;
                if (i >= 0) {
                    v[i].type = data.type;
                    v[i].content = data.content;
                } else {
                    v.push({...data});
                }
                return v;
            });
            
        }, () => this.analysisForm().valid(), i >= 0 ? '编辑解析' : '新增解析');
    }

    public tapRemove(i: number) {
        this.value.update(v => {
            v.splice(i, 1);
            return v;
        });
    }
}
