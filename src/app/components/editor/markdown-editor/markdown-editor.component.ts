import { Component, ElementRef, ViewContainerRef, inject, input, output, viewChild, model, effect, DestroyRef, afterNextRender } from '@angular/core';
import { IEditor, IEditorBlock, IImageUploadEvent } from '../model';
import { EditorService } from '../container';
import { EDITOR_EVENT_CUSTOM, EDITOR_EVENT_EDITOR_CHANGE, EDITOR_EVENT_EDITOR_READY, EDITOR_FULL_SCREEN_TOOL, EDITOR_PREVIEW_TOOL, IEditorTool } from '../base';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-markdown-editor',
    templateUrl: './markdown-editor.component.html',
    styleUrls: ['./markdown-editor.component.scss'],
})
export class MarkdownEditorComponent implements FormValueControl<string>, IEditor {

    private readonly destroyRef = inject(DestroyRef);

    private readonly modalViewContainer = viewChild('modalVC', { read: ViewContainerRef });
    private readonly areaElement = viewChild<ElementRef<HTMLTextAreaElement>>('editorArea');
    public readonly height = input(200);
    public readonly placeholder = input('');
    public readonly imageUpload = output<IImageUploadEvent>();
    public topLeftItems: IEditorTool[] = [];
    public topRightItems: IEditorTool[] = [];
    public readonly disabled = input<boolean>(false);
    public readonly value = model<string>('');
    public isPreview = false;
    public size = 0;
    public previewValue = '';
    public isFullScreen = false;
    private container: EditorService;

    constructor() {
        const container = inject(EditorService);

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
            this.value.set(this.container.value);
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
        effect(() => this.container.value = this.value());
        afterNextRender({
            write: () => this.container.ready(this.areaElement().nativeElement, this.modalViewContainer())
        });
        this.destroyRef.onDestroy(() => this.container.destroy());
    }

    get areaStyle() {
        return {
            height: this.height() + 'px',
        };
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
}
