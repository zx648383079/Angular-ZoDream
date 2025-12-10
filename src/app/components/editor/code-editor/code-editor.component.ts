import { AfterViewInit, Component, ElementRef, OnDestroy, ViewEncapsulation, effect, inject, input, model } from '@angular/core';
import { IEditor, IEditorBlock } from '../model';
import { CodeElement } from '../base/code';
import { EDITOR_EVENT_EDITOR_CHANGE } from '../base';
import { EditorService } from '../container';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    encapsulation: ViewEncapsulation.None,
    selector: 'app-code-editor',
    template: '',
    styleUrls: ['./code-editor.component.scss'],
    host: {
        'class': 'code-editor-container'
    },
})
export class CodeEditorComponent implements AfterViewInit, OnDestroy, FormValueControl<string>, IEditor {
    private elementRef = inject(ElementRef);


    public readonly disabled = input<boolean>(false);
    public readonly value = model<string>('');
    private container: EditorService;
    constructor() {
        const container = inject(EditorService);

        this.container = container.clone();
        this.container.on(EDITOR_EVENT_EDITOR_CHANGE, () => {
            this.value.set(this.container.value);
        });
        effect(() => this.container.value = this.value());
    }


    ngAfterViewInit(): void {
        this.container.ready(new CodeElement(this.elementRef.nativeElement, this.container));
    }

    ngOnDestroy(): void {
        this.container.destroy();
    }

    public insert(block: IEditorBlock|string): void {
        this.container.insert(block);
    }
}
