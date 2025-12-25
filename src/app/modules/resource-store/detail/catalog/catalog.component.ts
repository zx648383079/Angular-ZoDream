import { Component, input } from '@angular/core';
import { IResourceCatalog } from '../../model';

@Component({
    standalone: false,
    selector: 'app-catalog',
    templateUrl: './catalog.component.html',
    styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent {

    public readonly items = input<IResourceCatalog[]>([]);
 
    public toggleOpen(item: IResourceCatalog) {
        if (item.type > 0) {
            return;
        }
        item.open = !item.open;
    }
}
