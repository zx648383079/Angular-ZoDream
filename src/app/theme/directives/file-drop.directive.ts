import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[appFileDrop]'
})
export class FileDropDirective {

    @Output() public fileOver = new EventEmitter<boolean>();
    @Output() public fileDrop = new EventEmitter<File[]>();

    constructor(
        protected element: ElementRef,
    ) { }

    @HostListener('dragover', ['$event'])
    onDragOver(event: MouseEvent) {
        const transfer = this.getTransfer(event);
        if (!this.haveFiles(transfer.types)) {
            return;
        }
    
        transfer.dropEffect = 'copy';
        this.preventAndStop(event);
        this.fileOver.emit(true);
    }

    @HostListener('dragleave', ['$event'])
    onDragLeave(event: MouseEvent): void {
        if (this.element) {
            if (event.currentTarget === this.element.nativeElement) {
                return;
            }
        }
        this.preventAndStop(event);
        this.fileOver.emit(false);
    }

    @HostListener('drop', [ '$event' ])
    onDrop(event: MouseEvent): void {
        const transfer = this.getTransfer(event);
        if (!transfer) {
            return;
        }
        this.preventAndStop(event);
        this.fileOver.emit(false);
        this.fileDrop.emit(transfer.files);
    }


    private getTransfer(event: any): any {
        return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
    }
    
    private preventAndStop(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    private haveFiles(types: any) {
        if (!types) {
            return false;
        }
        if (types.indexOf) {
            return types.indexOf('Files') !== -1;
        } else if (types.contains) {
            return types.contains('Files');
        } else {
            return false;
        }
    }
}
