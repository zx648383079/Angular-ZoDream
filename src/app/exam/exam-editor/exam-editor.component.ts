import { AfterViewInit, Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DialogService } from '../../dialog';
import { EditorContainer, IEditor } from '../../editor';
import { FileUploadService } from '../../theme/services';
import { wordLength } from '../../theme/utils';

@Component({
    selector: 'app-exam-editor',
    templateUrl: './exam-editor.component.html',
    styleUrls: ['./exam-editor.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ExamEditorComponent),
            multi: true
        }
    ]
})
export class ExamEditorComponent implements AfterViewInit, ControlValueAccessor, IEditor, OnInit {

    @ViewChild('editorArea')
    private areaElement: ElementRef<HTMLTextAreaElement>;
    @Input() public height = 200;
    @Input() public placeholder = '';
    @Input() public label = '';

    public disable = false;
    public value = '';
    public isPreview = false;
    public previewValue = '';
    public fileName = this.uploadService.uniqueGuid();
    private container = new EditorContainer();

    onChange: any = () => { };
    onTouch: any = () => { };

    constructor(
        private uploadService: FileUploadService,
        private toastrService: DialogService,
    ) { }

    get size() {
        return wordLength(this.value);
    }

    get areaStyle() {
        return {
            height: this.height + 'px',
        };
    }
    ngOnInit() {
        this.container.on('change', () => {
            this.value = this.container.value;
            this.onValueChange();
        });
    }

    ngAfterViewInit() {
        this.container.ready(this.areaElement.nativeElement);
    }

    public onValueChange() {
        this.onChange(this.value);
    }

    public tapTool(name: string) {
        if (name === 'preview') {
            this.enterPreview();
            return;
        }
        if (name === 'image') {
            return;
        }
        if (name === 'math') {
            this.container.insertOrInclude('$$', 1);
            return ;
        }
        if (name === 'link') {
            return this.insert('[](https://)', 1, true);
        }
        if (name === 'input') {
            this.container.insert('____', 3);
            return;
        }
        if (name === 'underline') {
            this.container.insertOrInclude('----', 2);
            return;
        }
        if (name === 'wavyline') {
            this.container.insertOrInclude('~~~~', 2);
            return;
        }
    }

    public uploadImage(event: any) {
        const files = event.target.files as FileList;
        this.uploadService.uploadImages(files).subscribe({
            next: res => {
                for (const item of res) {
                    this.insertImage(item.url, item.original);
                }
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public insert(val: string, move?: number, focus?: boolean) {
        this.container.insert(val, move, focus);
    }

    public insertImage(file: string, name?: string) {
        this.container.insert('![](' + file + ')');
    }

    public insertLink(text: string, href: string) {
        this.container.insert('[' + text + '](' + href + ')');
    }

    writeValue(obj: any): void {
        this.value = obj;
        this.container.value = this.value;
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        this.disable = isDisabled;
    }

    private enterPreview() {
        if (this.isPreview) {
            this.isPreview = false;
            return;
        }
        this.previewValue = this.value;
        this.isPreview = true;
    }

}
