import { Component, Input, OnInit } from '@angular/core';
import { PanelWidget } from '../../../model';

@Component({
  selector: 'app-group-panel',
  templateUrl: './group-panel.component.html',
  styleUrls: ['./group-panel.component.scss']
})
export class GroupPanelComponent  {

    @Input() public value: PanelWidget;

    constructor() { }


}
