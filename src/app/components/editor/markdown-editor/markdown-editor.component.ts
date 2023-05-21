import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { FileUploadService } from '../../../theme/services';
import { EditorBlockType, IEditor, IEditorBlock, IEditorCodeBlock, IEditorLinkBlock, IImageUploadEvent } from '../model';
import { EditorContainer } from '../container';
import { EVENT_EDITOR_CHANGE, EVENT_EDITOR_READY } from '../base';

@Component({
    selector: 'app-markdown-editor',
    templateUrl: './markdown-editor.component.html',
    styleUrls: ['./markdown-editor.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MarkdownEditorComponent),
            multi: true
        }
    ]
})
export class MarkdownEditorComponent implements AfterViewInit, OnDestroy, ControlValueAccessor, IEditor {

    @ViewChild('editorArea')
    private areaElement: ElementRef<HTMLTextAreaElement>;
    @Input() public height = 200;
    @Input() public placeholder = '';
    @Output() public imageUpload = new EventEmitter<IImageUploadEvent>();

    public disabled = false;
    public isPreview = false;
    public size = 0;
    public previewValue: SafeHtml;
    public imageName = this.uploadService.uniqueGuid();
    private container = new EditorContainer();
    onChange: any = () => { };
    onTouch: any = () => { };

    constructor(
        private sanitizer: DomSanitizer,
        private uploadService: FileUploadService,
    ) {
        this.container.on(EVENT_EDITOR_CHANGE, () => {
            this.onChange(this.container.value);
            this.size = this.container.wordLength;
        }).on(EVENT_EDITOR_READY, () => {
            this.size = this.container.wordLength;
        });
    }

    get areaStyle() {
        return {
            height: this.height + 'px',
        };
    }

    ngAfterViewInit() {
        this.container.ready(this.areaElement.nativeElement);
    }

    ngOnDestroy(): void {
        this.container.destroy();
    }

    public tapTool(name: string) {
        if (name === 'preview') {
            this.enterPreview();
            return;
        }
        if (name === 'image') {
            return;
        }
        if (name === 'code') {
            this.insert(<IEditorCodeBlock>{
                type: EditorBlockType.AddCode,
                language: 'js'
            });
        }
        if (name === 'link') {
            this.insert(<IEditorLinkBlock>{
                type: EditorBlockType.AddLink
            });
            return;
        }
    }

    public uploadImage(event: any) {
        const files = event.target.files as FileList;
        this.imageUpload.emit({
            files,
            target: this
        });
    }

    public insert(block: IEditorBlock|string): void {
        this.container.insert(block);
    }

    writeValue(obj: any): void {
        this.container.value = obj;
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    private enterPreview() {
        if (this.isPreview) {
            this.isPreview = false;
            return;
        }
        this.previewValue = this.sanitizer.bypassSecurityTrustHtml(
            marked(this.container.value)
        );
        this.isPreview = true;
    }

}
