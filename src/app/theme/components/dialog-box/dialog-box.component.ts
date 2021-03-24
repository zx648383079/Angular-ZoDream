import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DialogAnimation } from '../../constants/dialog-animation';

@Component({
    selector: 'app-dialog-box',
    templateUrl: './dialog-box.component.html',
    styleUrls: ['./dialog-box.component.scss'],
    animations: [
        DialogAnimation,
    ],
})
export class DialogBoxComponent {

    @Input() public title: string;
    @Input() public visible = false;
    @Input() public height = 400;
    @Input() public checkFn: () => boolean;
    @Input() public confirmFn: () => void;
    @Output() public confirm = new EventEmitter();

    constructor() { }

    get boxStyle() {
        return {
            height: this.height + 'px',
            'margin-top': (- this.height / 2) + 'px'
        };
    }

    public closeDialog(yes = false) {
        if (!yes) {
            this.visible = false;
            return;
        }
        if (this.checkFn && !this.checkFn()) {
            return;
        }
        this.visible = false;
        if (this.confirmFn) {
            this.confirmFn();
        }
        this.confirm.emit();
    }

    public open(cb?: () => void, check?: () => boolean) {
        this.checkFn = check;
        this.confirmFn = cb;
        this.visible = true;
    }

}
