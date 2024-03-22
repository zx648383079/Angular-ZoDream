import { AfterViewInit, Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DialogService } from '../../../../components/dialog';
import { EditorBlockType, EditorService, IEditor, IEditorBlock, IEditorInclueBlock, IEditorLinkBlock, IEditorTextBlock } from '../../../../components/editor';
import { FileUploadService } from '../../../../theme/services';
import { wordLength } from '../../../../theme/utils';
import { MarkRangeMap } from '../math-mark/parser';

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

    onChange: any = () => { };
    onTouch: any = () => { };

    constructor(
        private uploadService: FileUploadService,
        private toastrService: DialogService,
        private container: EditorService,
    ) {

    }

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
            this.container.insert(<IEditorInclueBlock>{
                type: EditorBlockType.AddText,
                begin: '$',
                end: '$',
            });
            return;
        }
        if (name === 'link') {
            this.container.insert(<IEditorLinkBlock>{
                type: EditorBlockType.AddLink,
            });
            return;
        }
        if (name === 'input') {
            this.container.insert(<IEditorTextBlock>{
                type: EditorBlockType.AddText,
                value: '____',
                cursor: 3
            });
            return;
        }
        if (Object.prototype.hasOwnProperty.call(MarkRangeMap, name)) {
            const item = MarkRangeMap[name];
            this.container.insert(<IEditorInclueBlock>{
                type: EditorBlockType.AddText,
                begin: item.begin,
                end: item.end,
            });
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

    public insert(val: IEditorBlock|string) {
        this.container.insert(val);
    }

    public insertImage(file: string, name?: string) {
        this.container.insert('![](' + file + ')');
    }

    public insertLink(text: string, href: string) {
        this.container.insert('[' + text + '](' + href + ')');
    }

    writeValue(obj: any): void {
        this.value = typeof obj === 'undefined' ? '' : obj;
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
