import { Component, input, output } from '@angular/core';
import { TreeEvent, TreeItem } from '../../model';

@Component({
    standalone: false,
    selector: 'app-catalog-list',
    templateUrl: './catalog-list.component.html',
    styleUrls: ['./catalog-list.component.scss']
})
export class CatalogListComponent {

    public readonly items = input<TreeItem[]>([]);
    public readonly level = input(0);
    public readonly tapped = output<TreeEvent>();

}
