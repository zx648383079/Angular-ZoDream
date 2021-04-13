import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {

    @Input() public perPage = 20;
    @Input() public page = 1;
    @Input() public pageTotal = -1;
    @Input() public total = -1;
    @Input() public pageCount = 7;
    @Input() public directionLinks = false;
    @Output() public pageChange = new EventEmitter<number>();

    public items: number[] = [];

    constructor() { }

    private get realTotal() {
        if (this.pageTotal >= 0) {
            return this.pageTotal;
        }
        return Math.ceil(this.total / this.perPage);
    }

    public get canPrevious() {
        return this.page > 1;
    }

    public get canNext() {
        return this.page < this.realTotal;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.perPage || changes.page || changes.pageTotal || changes.total || changes.pageCount) {
            this.initPage();
        }
    }

    public tapItem(page: number) {
        if (page < 1) {
            return;
        }
        this.paginate(page);
    }

    public paginate(page: number = this.page) {
        if (page < 1) {
            page = 1;
        }
        const total = this.realTotal;
        if (page > total) {
            page = total;
        }
        this.page = page;
        this.initPage();
        this.pageChange.emit(page);
    }

    public previous() {
        if (this.page <= 1) {
            return;
        }
        this.paginate(this.page - 1);
    }

    public next() {
        if (this.page > this.realTotal) {
            return;
        }
        this.paginate(this.page + 1);
    }

    private initPage() {
        const total = this.realTotal;
        if (total < 2) {
            this.items = [];
            return;
        }
        const items = [];
        items.push(1);
        let lastList = Math.floor(this.pageCount / 2);
        let i = this.page - lastList;
        let length = this.page + lastList ;
        if (i < 2) {
            i = 2;
            length = i + this.pageCount
        }
        if (length > total - 1) {
            length = total - 1;
            i = Math.max(2, length - this.pageCount);
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
        items.push(total);
        this.items = items;
    }

}