import { Component, computed, effect, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements FormValueControl<number> {

    public readonly perPage = input(20);
    public readonly value = model(1);
    public readonly pageTotal = input(-1);
    public readonly total = input(-1);
    public readonly pageCount = input(window.innerWidth > 576 ? 7 : 3);
    public readonly directionLinks = input(false);
    public readonly goto = input(false);

    public items: number[] = [];
    private readonly realTotal = computed(() => {
        if (this.pageTotal() >= 0) {
            return this.pageTotal();
        }
        return Math.ceil(this.total() / this.perPage());
    });
    public readonly canPrevious = computed(() => this.value() > 1);
    public readonly canNext = computed(() => this.value() < this.realTotal());

    constructor() {
        effect(() => {
            this.perPage();
            this.value();
            this.pageTotal();
            this.total();
            this.pageCount();
            this.initPage();
        });
    }



    public onKeyDown(event: KeyboardEvent) {
        if (event.key !== 'Enter') {
            return;
        }
        this.paginate(parseInt((event.target as HTMLInputElement).value, 10));
    }

    public tapItem(page: number) {
        if (page < 1) {
            return;
        }
        this.paginate(page);
    }

    public paginate(page: number = this.value()) {
        if (!page || page < 1) {
            page = 1;
        }
        const total = this.realTotal();
        if (page > total) {
            page = total;
        }
        this.value.set(page);
        this.initPage();
    }

    public previous() {
        if (this.value() <= 1) {
            return;
        }
        this.paginate(this.value() - 1);
    }

    public next() {
        if (this.value() > this.realTotal()) {
            return;
        }
        this.paginate(this.value() + 1);
    }

    private initPage() {
        const total = this.realTotal();
        const page = this.value();
        if (total < 2 && page === 1) {
            this.items = [];
            return;
        }
        const items = [];
        items.push(1);
        let lastList = Math.floor(this.pageCount() / 2);
        let i = page - lastList;
        let length = page + lastList ;
        if (i < 2) {
            i = 2;
            length = i + this.pageCount()
        }
        if (length > total - 1) {
            length = total - 1;
            i = Math.max(2, length - this.pageCount());
        }
        if (i > 2) {
            items.push(0);
        }
        for (; i <= length; i ++) {
            items.push(i);
        }
        if (length < total - 1) {
            items.push(0);
        }
        if (total > 1) {
            items.push(total);
        }
        this.items = items;
    }

}
