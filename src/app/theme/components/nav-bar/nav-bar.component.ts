import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export interface INav {
    name: string;
    icon?: string;
    label?: string;
    url?: string;
    urlQuery?: any;
    children?: INav[];
    expand?: boolean;
    active?: boolean;
    role?: string;
}

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

    public navToggle = false;

    @Input() public menu: INav[] = [];

    @Input() public bottomMenu: INav[] = [];

    @Input() public hasSuggest = false;

    @Input() public suggestItems: string[] = [];

    @Output() public textChanged = new EventEmitter<string>();
    @Output() public querySubmitted = new EventEmitter<string>();
    @Output() public suggestionChosen = new EventEmitter<number>();

    public suggestText = '';

    constructor() { }

    ngOnInit() {
    }

    public tapSuggest() {
        const isOpen = document.body.clientWidth <= 769;
        if (this.navToggle !== isOpen) {
            this.navToggle = isOpen;
            return;
        }
        this.querySubmitted.emit(this.suggestText);
    }

    public suggestKeyPress(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            this.querySubmitted.emit(this.suggestText);
            return;
        }
        this.textChanged.emit(this.suggestText);
    }

    public tapSuggestion(i: number) {
        this.suggestionChosen.emit(i);
    }

    public tapItem(item: INav, e: MouseEvent) {
        e.stopPropagation();
        this.isActive(this.menu, item);
        this.isActive(this.bottomMenu, item);
    }

    private isActive(items: INav[], current: INav) {
        let res = false;
        for (const item of items) {
            item.active = false;
            item.expand = false;
            if (item === current) {
                item.active = true;
                item.expand = item.children && item.children.length > 0;
                res = true;
            }
            if (!item.children || item.children.length < 1) {
                continue;
            }
            if (this.isActive(item.children, current)) {
                item.expand = true;
                res = true;
                continue;
            }
        }
        return res;
    }
}
