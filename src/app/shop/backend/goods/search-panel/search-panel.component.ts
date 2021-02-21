import { Component, EventEmitter, Output } from '@angular/core';
import { IGoods, IProduct } from '../../../../theme/models/shop';
import { GoodsService } from '../goods.service';

@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss']
})
export class SearchPanelComponent {

    public keywords = '';
    public items: IGoods[] = [];
    public children: IProduct[] = [];
    public selected: IGoods;
    public selectedChild: IProduct;
    public childVisible = false;
    @Output() public valueChange = new EventEmitter<{
        item: IGoods;
        child: IProduct;
    }>();

    constructor(
        private service: GoodsService
    ) {

    }

    public onKeyDown(event: KeyboardEvent) {
        if (event.code !== 'Enter') {
            return;
        }
        this.tapSearch();
    }

    public tapSearch() {
        if (this.keywords.length < 1) {
            return;
        }
        this.service.search({
            keywords: this.keywords
        }).subscribe(res => {
            this.items = res.data;
        });
    }

    public tapSelected(item: IGoods) {
        this.selected = item;
        this.selectedChild = undefined;
        this.children = item.products ? item.products : [];
        if (this.children.length < 1) {
            this.output();
            return;
        }
        this.childVisible = true;
    }

    public tapSelectedChild(item: IProduct) {
        this.selectedChild = item;
        this.output();
    }

    private output() {
        this.valueChange.emit({
            item: this.selected,
            child: this.selectedChild
        });
    }
}
