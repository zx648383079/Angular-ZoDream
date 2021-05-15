import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TreeEvent, TreeItem } from '../../model';

@Component({
  selector: 'app-catalog-list',
  templateUrl: './catalog-list.component.html',
  styleUrls: ['./catalog-list.component.scss']
})
export class CatalogListComponent {

    @Input() public items: TreeItem[] = [];
    @Input() public level = 0;
    @Output() public tapped = new EventEmitter<TreeEvent>();

    constructor() { }
}
