import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-edit-header',
  templateUrl: './edit-header.component.html',
  styleUrls: ['./edit-header.component.scss']
})
export class EditHeaderComponent implements OnChanges {

  @Input() title = '';

  @Input() min = false;

  @Input() disabled = false;

  @Output() submited = new EventEmitter();

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
