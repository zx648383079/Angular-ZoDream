import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-edit-classify',
  templateUrl: './edit-classify.component.html',
  styleUrls: ['./edit-classify.component.scss']
})
export class EditClassifyComponent {

    @Output() public closed = new EventEmitter();
    public value = '';

    constructor() { }

    public tapClose() {
        this.closed.emit();
    }
}
