import { Component, ViewContainerRef } from '@angular/core';
import { DialogService } from '../dialog.service';

@Component({
    standalone: false,
    selector: 'app-dialog-container',
    template: '',
    styles: [''],
})
export class DialogContainerComponent {

    constructor(
        private service: DialogService,
        private viewContainerRef: ViewContainerRef,
    ) {
        this.service.containerRef = this.viewContainerRef;
    }
}
