import { Directive, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';
import { EditorHelper } from '../../editor/base/util';

const MimeType = 'application/json';

@Directive({
    standalone: false,
    selector: '[appDragDrop]',
    host: {
        '[attr.draggable]': "draggable()"
    }
})
export class DragDropDirective {
    private element = inject<ElementRef<HTMLDivElement>>(ElementRef);


    public readonly appDragDrop = input<any>(undefined);
    public readonly placeholderHeight = input(0);
    public readonly effectAllowed = input<'none' | 'copy' | 'copyLink' | 'copyMove' | 'link' | 'linkMove' | 'move' | 'all' | 'uninitialized'>('move');

    public readonly appDrog = output<{
        data: any;
        before: boolean;
    }>();

    public readonly draggable = signal(true);
    private static placeholder: HTMLElement | null = null;


    @HostListener('dragstart', ['$event']) 
    public onDragStart(event: DragEvent): boolean {
        if (!this.draggable()) {
            return false;
        }
        event.stopPropagation();
        event.dataTransfer.setData(MimeType, JSON.stringify(this.appDragDrop()));
        event.dataTransfer.effectAllowed = this.effectAllowed();
        this.tryGetPlaceholder();
        return true;
    }

    @HostListener('dragover', ['$event']) 
    public onDragOver(event: DragEvent): boolean {
        if (!this.draggable()) {
            return false;
        }
        event.preventDefault();
        event.stopPropagation();
        this.checkAndUpdatePlaceholderPosition(event);
        return true;
    }

    @HostListener('drop', ['$event']) 
    public onDrop(event: DragEvent): boolean {
        event.stopPropagation();
        const target = JSON.parse(event.dataTransfer.getData(MimeType));
        const before = this.getDirectFromEvent(event);
        this.removePlaceholder();
        this.appDrog.emit({
            data: target,
            before,
        });
        return true;
    }

    private getDirectFromEvent(event: DragEvent) {
        const bound = (event.target as HTMLDivElement).getBoundingClientRect();
        return event.clientY < bound.top + bound.height / 2;
    }

    private tryGetPlaceholder() {
        if (!DragDropDirective.placeholder) {
            const element = document.createElement('div');
            element.setAttribute('appDragDropPlaceholder', '');
            DragDropDirective.placeholder = element;
        }
        DragDropDirective.placeholder.style.height = (this.placeholderHeight() <= 0 ? this.element.nativeElement.clientHeight : this.placeholderHeight()) + 'px';
    }

    private checkAndUpdatePlaceholderPosition(event: DragEvent) {
        if (this.getDirectFromEvent(event)) {
            EditorHelper.insertBefore(event.target as any, DragDropDirective.placeholder);
        } else {
            EditorHelper.insertAfter(event.target as any, DragDropDirective.placeholder);
        }
    }

    private removePlaceholder() {
        EditorHelper.removeNode(DragDropDirective.placeholder);
        DragDropDirective.placeholder = null;
    }
    
}
