import { Component, Input, OnInit } from '@angular/core';
import { IResourceCatalog } from '../../model';

@Component({
    standalone: false,
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent {

    @Input() public items: IResourceCatalog[] = [];
 
    constructor() { }

    public toggleOpen(item: IResourceCatalog) {
        if (item.type > 0) {
            return;
        }
        item.open = !item.open;
    }
}
