import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DialogEvent } from '../../../dialog';
import { FileUploadService } from '../../../theme/services';
import { cloneObject } from '../../../theme/utils';
import { IQuestion, IQuestionAnalysis, IQuestionOption, QuestionDefaultOption, QuestionTypeItems } from '../../model';
import { questionNeedOption } from '../../util';

@Component({
  selector: 'app-question-editor',
  templateUrl: './question-editor.component.html',
  styleUrls: ['./question-editor.component.scss']
})
export class QuestionEditorComponent implements OnChanges {

    @Input() public editable = true;
    @Input() public value: IQuestion;

    public optionItems: any[] = cloneObject(QuestionDefaultOption);
    public materialType = 0;
    public materialFile = '';
    public analysisItems: IQuestionAnalysis[] = [];
    public analysisTypeItems = ['文本', '音频', '视频'];
    public kidItems: IQuestion[] = [];
    
    public analysisData: IQuestionAnalysis = {
        type: 0,
        content: '',
    };
    public optionData: IQuestionOption = {
        type: 0,
        content: '',
        checked: false,
    } as any;
    public typeItems = QuestionTypeItems;
    public typeOpen = false;
    public extendOpen = false;

    @Output() public valueChange = new EventEmitter<IQuestion>();

    private asyncHandle = 0;

    constructor(
        private uploadService: FileUploadService,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.value) {
            this.formatValue(changes.value.currentValue);
        }
    }

    public get canEdit() {
        return !this.value.id || this.value.id < 1 || this.value.editable;
    }

    public tapType(i: number) {
        this.typeOpen = false;
        if (!this.canEdit) {
            return;
        }
        this.value.type = i;
        if (i == 4) {
            this.extendOpen = true;
        }
        this.onValueChange();
    }

    public onExtendChange() {
        this.onTypeChange();
        this.onValueChange();
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

    public tapEditAnalysis(modal: DialogEvent) {
        let i = this.analysisItems.length > 0 ? 0 : -1;
        this.analysisData = i >= 0 ? {...this.analysisItems[i]} : {
            type: 0,
            content: '',
        };
        modal.open(() => {
            if (i >= 0) {
                this.analysisItems[i] = {...this.analysisData};
            } else {
                this.analysisItems.push({...this.analysisData});
            }
            this.onValueChange();
        });
    }

    public uploadFile(event: Event) {
        if (!this.canEdit) {
            return;
        }
        const file = (event.target as HTMLInputElement).files[0] as File;
        const applyMaterial = (type: number, url: string) => {
            this.materialType = type;
            this.materialFile = url;
            this.value.material_id = 0;
            this.onValueChange();
        };
        if (file.type.charAt(0) === 'i') {
            this.uploadService.uploadImage(file).subscribe(res => {
                applyMaterial(0, res.url);
            });
            return;
        }
        if (file.type.charAt(0) === 'a') {
            this.uploadService.uploadAudio(file).subscribe(res => {
                applyMaterial(1, res.url);
            });
            return;
        }
        if (file.type.charAt(0) === 'v') {
            this.uploadService.uploadVideo(file).subscribe(res => {
                applyMaterial(2, res.url);
            });
            return;
        }
    }

    public tapRemoveMaterial() {
        this.materialFile = '';
        this.value.material_id = 0;
        this.value.image = '';
        this.onValueChange();
    }

    public onValueChange() {
        this.asyncOuput();
    }

    private asyncOuput() {
        if (this.asyncHandle) {
            clearTimeout(this.asyncHandle);
        }
        this.asyncHandle = window.setTimeout(() => {
            this.asyncHandle = 0;
            this.output();
        }, 500);
    }

    private output() {
        const value: IQuestion = {
            ...this.value,
            material: undefined,
            type: this.value.type || 0,
        } as any;
        if (this.materialFile) {
            if (this.materialType > 0) {
                value.material = {
                    id: this.value.material_id,
                    type: this.materialType,
                    content: this.materialFile
                } as any;
            } else {
                value.image = this.materialFile;
            }
        }
        if (questionNeedOption(value)) {
            value.option_items = this.optionItems;
        }
        if (value.type == 5) {
            value.children = this.kidItems;
        }
        value.analysis_items = this.analysisItems;
        this.valueChange.emit(this.value = value);
    }

    private formatValue(value?: IQuestion) {
        const def = this.canEdit ? cloneObject(QuestionDefaultOption) : [];
        if (!value) {
            this.materialFile = '';
            this.optionItems = def;
            this.analysisItems = [];
            this.kidItems = [];
            return;
        }
        this.materialType = value.material?.type || 0;
        this.materialFile = value.material?.content || '';
        if (!this.materialFile && value.image) {
            this.materialType = 0;
            this.materialFile = value.image;
        }
        this.optionItems = value.option_items ? value.option_items : def;
        this.analysisItems = value.analysis_items || [];
        this.kidItems = value.children || [];
    }
}
