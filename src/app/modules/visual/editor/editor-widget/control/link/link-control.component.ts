import { Component, OnInit, input } from '@angular/core';
import { Widget } from '../../../model';

@Component({
    standalone: false,
    selector: 'app-link-control',
    templateUrl: './link-control.component.html',
    styleUrls: ['./link-control.component.scss']
})
export class LinkControlComponent  {

    public readonly value = input<Widget>(undefined);


}
