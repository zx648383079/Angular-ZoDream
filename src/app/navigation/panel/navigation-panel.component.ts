import { Component, OnInit } from '@angular/core';
import { ISiteCollectGroup } from '../model';

@Component({
  selector: 'app-navigation-panel',
  templateUrl: './navigation-panel.component.html',
  styleUrls: ['./navigation-panel.component.scss']
})
export class NavigationPanelComponent {

    public editMode = false;
    public items: ISiteCollectGroup[] = [];

    constructor() { }

}
