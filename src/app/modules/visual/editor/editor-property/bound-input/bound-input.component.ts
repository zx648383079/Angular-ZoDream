import { Component, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-editor-bound-input',
    templateUrl: './bound-input.component.html',
    styleUrls: ['./bound-input.component.scss'],
    host: {
        class: 'control-row'
    },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => EditorBoundInputComponent),
        multi: true
    }]
})
export class EditorBoundInputComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
