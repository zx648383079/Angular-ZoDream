import { AfterViewInit, Component, ComponentRef, ElementRef, EventEmitter, forwardRef, Injector, Input, OnDestroy, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FileUploadService } from '../../../theme/services';
import { EditorBlockType, IEditor, IEditorBlock, IEditorCodeBlock, IEditorLinkBlock, IEditorModal, IEditorSharedModal, IImageUploadEvent } from '../model';
import { EditorContainer } from '../container';
import { EDITOR_CODE_TOOL, EDITOR_EVENT_EDITOR_CHANGE, EDITOR_EVENT_EDITOR_READY, EDITOR_FULL_SCREEN_TOOL, EDITOR_PREVIEW_TOOL, IEditorTool } from '../base';
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
    private modalRef: ComponentRef<IEditorModal>;
    private container = new EditorContainer();
    onChange: any = () => { };
    onTouch: any = () => { };

    constructor(
        private injector: Injector,
    ) {
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

    public tapTool(item: IEditorTool, event: MouseEvent) {
        this.container.focus();
        this.executeModule(item, this.getOffsetPosition(event));
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

    private executeModule(item: IEditorTool, position: IPoint) {
        if (this.modalRef) {
            this.modalRef.destroy();
            this.modalRef = undefined;
        }
        if (item.name === EDITOR_PREVIEW_TOOL) {
            this.enterPreview();
            return;
        }
        if (item.name === EDITOR_FULL_SCREEN_TOOL) {
            this.isFullScreen = !this.isFullScreen;
            return;
        }
        const module = this.container.option.toModule(item);
        if (!module) {
            return;
        }
        if (!module.modal) {
            this.container.execute(module);
            return;
        }
        this.modalRef = this.modalViewContainer.createComponent<IEditorModal>(module.modal, {
            injector: this.injector
        });
        if (typeof (this.modalRef.instance as IEditorSharedModal).modalReady === 'function') {
            (this.modalRef.instance as IEditorSharedModal).modalReady(module);
        }
        this.modalRef.instance.open({}, res => {
            this.modalRef.destroy();
            this.modalRef = undefined;
            this.container.execute(module, undefined, res);
        }, position);
    }

    private getOffsetPosition(event: MouseEvent): IPoint {
        const ele = this.areaElement.nativeElement;
        const rect = ele.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
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
