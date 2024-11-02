import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IEditor, IEditorBlock, IImageUploadEvent } from '../model';
import { EditorService } from '../container';
import { EDITOR_EVENT_CUSTOM, EDITOR_EVENT_EDITOR_CHANGE, EDITOR_EVENT_EDITOR_READY, EDITOR_FULL_SCREEN_TOOL, EDITOR_PREVIEW_TOOL, IEditorTool } from '../base';
import { IPoint } from '../../../theme/utils/canvas';

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

    @ViewChild('modalVC', {read: ViewContainerRef})
    private modalViewContainer: ViewContainerRef;
    @ViewChild('editorArea')
    private areaElement: ElementRef<HTMLTextAreaElement>;
    @Input() public height = 200;
    @Input() public placeholder = '';
    @Output() public imageUpload = new EventEmitter<IImageUploadEvent>();
    public topLeftItems: IEditorTool[] = [];
    public topRightItems: IEditorTool[] = [];
    public disabled = false;
    public isPreview = false;
    public size = 0;
    public previewValue = '';
    public isFullScreen = false;
    private container: EditorService;
    onChange: any = () => { };
    onTouch: any = () => { };

    constructor(
        container: EditorService
    ) {
        this.container = container.clone();
        this.container.option.merge({
            toolbar: {
                left: ['bold', 'link', 'image', 'code'],
                right: ['undo', 'redo', 'preview']
            }
        });
        this.topLeftItems = this.container.option.leftToolbar;
        this.topRightItems = this.container.option.rightToolbar;
        this.container.on(EDITOR_EVENT_EDITOR_CHANGE, () => {
            this.onChange(this.container.value);
            this.size = this.container.wordLength;
        }).on(EDITOR_EVENT_EDITOR_READY, () => {
            setTimeout(() => {
                this.size = this.container.wordLength;
            }, 10);
        }).on(EDITOR_EVENT_CUSTOM, e => {
            if (e.name === EDITOR_PREVIEW_TOOL) {
                this.enterPreview();
                return;
            }
            if (e.name === EDITOR_FULL_SCREEN_TOOL) {
                this.isFullScreen = !this.isFullScreen;
            }
        });
    }

    get areaStyle() {
        return {
            height: this.height + 'px',
        };
    }

    ngAfterViewInit() {
        this.container.ready(this.areaElement.nativeElement, this.modalViewContainer);
    }

    ngOnDestroy(): void {
        this.container.destroy();
    }

    public tapTool(item: IEditorTool, event: MouseEvent) {
        this.container.emitTool(item, event);
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

    private enterPreview() {
        if (this.isPreview) {
            this.isPreview = false;
            return;
        }
        this.previewValue = this.container.value;
        this.isPreview = true;
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
}
