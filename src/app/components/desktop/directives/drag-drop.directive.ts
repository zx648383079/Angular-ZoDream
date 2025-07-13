import { AfterViewInit, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { EditorHelper } from '../../editor/base/util';

const MimeType = 'application/json';

@Directive({
    standalone: false,
    selector: '[appDragDrop]'
})
export class DragDropDirective implements AfterViewInit {

    @Input() public appDragDrop: any;
    @Input() public placeholderHeight = 0;
    @Input() public effectAllowed: 'none' | 'copy' | 'copyLink' | 'copyMove' | 'link' | 'linkMove' | 'move' | 'all' | 'uninitialized' = 'move';

    @Output() public appDrog = new EventEmitter<{
        data: any;
        before: boolean;
    }>();

    @HostBinding('attr.draggable') draggable = true;
    private static placeholder: HTMLElement | null = null;

    constructor(
        private element: ElementRef<HTMLDivElement>
    ) { }

    ngAfterViewInit(): void {
    }

    @HostListener('dragstart', ['$event']) 
    onDragStart(event: DragEvent): boolean {
        if (!this.draggable) {
            return false;
        }
        event.stopPropagation();
        event.dataTransfer.setData(MimeType, JSON.stringify(this.appDragDrop));
        event.dataTransfer.effectAllowed = this.effectAllowed;
        this.tryGetPlaceholder();
        return true;
    }

    @HostListener('dragover', ['$event']) 
    onDragOver(event: DragEvent): boolean {
        if (!this.draggable) {
            return false;
        }
        event.preventDefault();
        event.stopPropagation();
        this.checkAndUpdatePlaceholderPosition(event);
        return true;
    }

    @HostListener('drop', ['$event']) 
    onDrop(event: DragEvent): boolean {
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
        DragDropDirective.placeholder.style.height = (this.placeholderHeight <= 0 ? this.element.nativeElement.clientHeight : this.placeholderHeight) + 'px';
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
