import { Component, ViewContainerRef, inject } from '@angular/core';
import { DialogService } from '../dialog.service';

@Component({
    standalone: false,
    selector: 'app-dialog-container',
    template: '',
    styles: [''],
})
export class DialogContainerComponent {
    private service = inject(DialogService);
    private viewContainerRef = inject(ViewContainerRef);


    constructor() {
        this.service.containerRef = this.viewContainerRef;
    }
}
