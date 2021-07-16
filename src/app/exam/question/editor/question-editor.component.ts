import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DialogEvent } from '../../../dialog';
import { FileUploadService } from '../../../theme/services';
import { IQuestion, IQuestionAnalysis, IQuestionOption } from '../../model';

@Component({
  selector: 'app-question-editor',
  templateUrl: './question-editor.component.html',
  styleUrls: ['./question-editor.component.scss']
})
export class QuestionEditorComponent implements OnChanges {

    @Input() public editable = true;
    @Input() public value: IQuestion;

    public opitonItems: any[] = [
        {content: '对', checked: false},
        {content: '错', checked: false}
    ];
    public content = '';
    public score = '';
    public materialType = 0;
    public materialFile = '';
    public analysisItems: IQuestionAnalysis[] = [];
    public analysisTypeItems = ['文本', '音频', '视频'];
    public optionTypeItems = ['文字', '图片'];
    public analysisData: IQuestionAnalysis = {
        type: 0,
        content: '',
    };
    public optionData: IQuestionOption = {
        type: 0,
        content: '',
        checked: false,
    } as any;

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

    public tapSelected(event: MouseEvent, i: number) {
        event.stopPropagation();
        if (!this.canEdit) {
            return;
        }
        const item = this.opitonItems[i];
        item.checked = !item.checked;
        this.onValueChange();
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

    public tapEditOption(modal: DialogEvent, i = -1) {
        if (!this.canEdit) {
            return;
        }
        this.optionData = i >= 0 ? {...this.opitonItems[i], type: this.opitonItems[i].type || 0} : {
            type: 0,
            content: this.getNewOptionLabel(),
            checked: false,
        } as any;
        modal.open(() => {
            if (i >= 0) {
                this.opitonItems[i] = {...this.optionData};
            } else {
                this.opitonItems.push({...this.optionData});
            }
            this.onValueChange();
        });
    }

    private getNewOptionLabel(): string {
        let label = '选项';
        switch (this.opitonItems.length) {
            case 0:
                return '对';
            case 1:
                return this.opitonItems[0].content === '对' ? '错' : '对';
            default:
                break;
        }
        return label;
    }

    public tapAddOption() {
        if (!this.canEdit) {
            return;
        }
        this.opitonItems.push({
            content: this.getNewOptionLabel(),
            checked: false
        });
        this.onValueChange();
    }

    public tapRemoveOption(event: MouseEvent, i: number) {
        event.stopPropagation();
        if (!this.canEdit) {
            return;
        }
        this.opitonItems.splice(i, 1);
        this.onValueChange();
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
            title: this.content,
            type: 0,
            material: undefined,
        } as any;
        if (this.materialFile) {
            value.material = {
                id: this.value.material_id,
                type: this.materialType,
                content: this.materialFile
            } as any;
        }
        let count = 0;
        value.option_items = this.opitonItems.map(i => {
            if (i.checked) {
                count ++;
            }
            return {
                id: i.id,
                type: i.type,
                content: i.content,
                is_right: i.checked
            } as any;
        });
        if (count > 1) {
            value.type = 1;
        }
        value.score = parseInt(this.score) || 0;
        value.analysis_items = this.analysisItems;
        this.valueChange.emit(this.value = value);
    }

    private formatValue(value?: IQuestion) {
        const def = this.canEdit ? [{content: '对', checked: false},
        {content: '错', checked: false}] : [];
        if (!value) {
            this.content = '';
            this.materialFile = '';
            this.opitonItems = def;
            this.analysisItems = [];
            return;
        }
        this.content = value.title;
        this.score = value.score as any || '';
        this.materialType = value.material?.type || 0;
        this.materialFile = value.material?.content || '';
        if (value.type === 2) {
            value.option_items = [
                {content: '对', is_right: value.answer > 0},
                {content: '错', is_right: value.answer < 1}
            ];
        } else if (value.type === 3) {
            value.option_items = [{content: value.answer, is_right: true}];
        }
        this.opitonItems = value.option_items ? value.option_items.map(i => {
            return {
                id: i.id,
                type: i.type,
                content: i.content,
                checked: i.is_right
            };
        }) : def;
        this.analysisItems = value.analysis_items || [];
    }
}
