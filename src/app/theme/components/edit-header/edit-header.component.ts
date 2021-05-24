import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-edit-header',
  templateUrl: './edit-header.component.html',
  styleUrls: ['./edit-header.component.scss']
})
export class EditHeaderComponent implements OnChanges {

    @Input() public title = '';

    @Input() public min = false;

    @Input() public disabled = false;

    @Output() public submited = new EventEmitter();

    constructor() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.title) {
            document.title = changes.title.currentValue;
        }
    }

    public tapSubmit() {
        if (this.disabled) {
            return;
        }
        this.submited.emit();
    }

}
