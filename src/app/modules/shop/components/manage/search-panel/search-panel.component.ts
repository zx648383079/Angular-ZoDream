import { Component, inject, output, signal } from '@angular/core';
import { IGoods, IProduct } from '../../../model';
import { HttpClient } from '@angular/common/http';
import { IPage } from '../../../../../theme/models/page';

@Component({
    standalone: false,
    selector: 'app-search-panel',
    templateUrl: './search-panel.component.html',
    styleUrls: ['./search-panel.component.scss']
})
export class SearchPanelComponent {
    private readonly http = inject(HttpClient);


    public readonly keywords = signal('');
    public readonly items = signal<IGoods[]>([]);
    public readonly children = signal<IProduct[]>([]);
    public readonly selected = signal<IGoods|null>(null);
    public readonly selectedChild = signal<IProduct|null>(null);
    public readonly childVisible = signal(false);
    public readonly valueChange = output<{
        item: IGoods;
        child: IProduct;
    }>();

    public onKeyDown(event: KeyboardEvent) {
        if (event.key !== 'Enter') {
            return;
        }
        this.tapSearch();
    }

    public tapSearch() {
        if (this.keywords.length < 1) {
            return;
        }
        this.search({
            keywords: this.keywords
        }).subscribe(res => {
            this.items.set(res.data);
        });
    }

    public tapSelected(item: IGoods) {
        this.selected.set(item);
        this.selectedChild.set(null);
        this.children.set(item.products ? item.products : []);
        if (this.children().length < 1) {
            this.output();
            return;
        }
        this.childVisible.set(true);
    }

    public tapSelectedChild(item: IProduct) {
        this.selectedChild.set(item);
        this.output();
    }

    private output() {
        this.valueChange.emit({
            item: this.selected()!,
            child: this.selectedChild()!
        });
    }

    public search(params: any) {
        return this.http.get<IPage<IGoods>>('shop/admin/goods/search', {
            params
        });
    }
}
