import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FileUploadService } from '../../../theme/services';
import { IQuestion } from '../../model';

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
    public materialType = 0;
    public materialFile = '';

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

    public tapSelected(i: number) {
        const item = this.opitonItems[i];
        item.checked = !item.checked;
        this.onValueChange();
    }

    public tapAddOption() {
        let label = '选项';
        switch (this.opitonItems.length) {
            case 0:
                label = '对';
                break;
            case 1:
                label = this.opitonItems[0].content === '对' ? '错' : '对';
                break;
            default:
                break;
        }
        this.opitonItems.push({
            content: label,
            checked: false
        });
        this.onValueChange();
    }

    public tapRemoveOption(event: MouseEvent, i: number) {
        event.stopPropagation();
        this.opitonItems.splice(i, 1);
        this.onValueChange();
    }

    public uploadFile(event: Event) {
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
            id: this.value.id,
            title: this.content,
            type: 0,
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
                content: i.content,
                is_right: i.checked
            } as any;
        });
        if (count > 1) {
            value.type = 1;
        }
        this.valueChange.emit(this.value = value);
    }

    private formatValue(value?: IQuestion) {
        const def = [{content: '对', checked: false},
        {content: '错', checked: false}];
        if (!value) {
            this.content = '';
            this.materialFile = '';
            this.opitonItems = def;
            return;
        }
        this.content = value.title;
        this.materialType = value.material?.type || 0;
        this.materialFile = value.material?.content || '';
        this.opitonItems = value.option_items ? value.option_items.map(i => {
            return {
                id: i.id,
                content: i.content,
                checked: i.is_right
            };
        }) : def;
    }
}
