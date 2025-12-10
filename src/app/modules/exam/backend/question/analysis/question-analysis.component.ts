import { Component, OnInit, input, output as output_1 } from '@angular/core';
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

    public readonly value = input<IQuestionAnalysis[]>([]);
    public analysisTypeItems = ['文本', '音频', '视频'];
    public analysisData: IQuestionAnalysis = {
        type: 0,
        content: '',
    };
    public readonly valueChange = output<IQuestionAnalysis[]>();

    constructor() { }


    public tapEdit(modal: DialogEvent, i = -1) {
        this.analysisData.type = i >= 0 ? this.value()[i].type : 0;
        this.analysisData.content = i >= 0 ? this.value()[i].content : '';
        modal.open(() => {
            if (i >= 0) {
                value[i].type = this.analysisData.type;
                value[i].content = this.analysisData.content;
            } else {
                this.value().push({...this.analysisData});
            }
            this.output();
        }, () => !emptyValidate(this.analysisData.content), i >= 0 ? '编辑解析' : '新增解析');
    }

    public tapRemove(i: number) {
        this.value().splice(i, 1);
        this.output();
    }

    private output() {
        this.valueChange.emit(this.value());
    }
}
