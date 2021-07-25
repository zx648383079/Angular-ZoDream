import { Component, OnInit, Input, Output, EventEmitter, Renderer2, OnDestroy } from '@angular/core';
import { SearchService } from '../../services';

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
export class NavBarComponent implements OnInit, OnDestroy {

    public navToggle = 0; // 0 为展开 1 为 一条线 2 为 一个点 3 为不显示
    public navFlow = false;
    public suggestIndex = -1;
    @Input() public menu: INav[] = [];
    @Input() public bottomMenu: INav[] = [];
    @Input() public hasSuggest = false;
    @Input() public suggestItems: any[] = [];
    @Output() public textChanged = new EventEmitter<string>();
    @Output() public querySubmitted = new EventEmitter<any>();
    @Output() public suggestionChosen = new EventEmitter<number>();

    public suggestText = '';

    constructor(
        private renderer: Renderer2,
        private searchService: SearchService,
    ) { }

    ngOnInit() {
        this.searchService.on('toggle', (res: number) => {
            this.navToggle = typeof res === 'number' ? res : 0;
        });
        this.searchService.on('suggest', items => {
            this.suggestIndex = -1;
            this.suggestItems = items;
        });
        this.renderer.listen(window, 'resize', () => {
            this.resize();
        });
        this.resize();
    }

    ngOnDestroy() {
        this.searchService.offTrigger();
        this.searchService.off('toggle');
    }

    public formatTitle(item: any) {
        if (typeof item !== 'object') {
            return item;
        }
        return item.title || item.name;
    }

    private resize() {
        const isFlow = document.body.clientWidth <= 769;
        this.navFlow = isFlow;
        if (isFlow && this.navToggle < 1) {
            this.navToggle = 1;
        }
    }

    public get navClass() {
        return {'nav-flow': this.navFlow && this.navToggle < 1, 'nav-min': this.navToggle === 1, 'nav-mini': this.navToggle === 2, 'nav-hide': this.navToggle > 2};
    }

    public tapToggle() {
        this.navToggle = this.navToggle > 1 ? 0 : (this.navToggle + 1);
    }

    public tapSuggest() {
        this.navToggle = 0;
        this.querySubmitted.emit(this.suggestText);
    }

    public suggestKeyPress(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            const item = this.suggestIndex >= 0 ? this.suggestItems[this.suggestIndex] : this.suggestText;
            this.searchService.emit('confirm', item);
            this.querySubmitted.emit(item);
            return;
        }
        
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') {
            this.suggestIndex = -1;
            this.textChanged.emit(this.suggestText);
            return;
        }
        if (this.suggestItems.length < 0) {
            return;
        }
        let i = this.suggestIndex;
        if (e.key === 'ArrowDown') {
            i = i < this.suggestItems.length - 1 ? i + 1 : 0;
        } else if (e.key === 'ArrowUp') {
            i = (i < 1 ? this.suggestItems.length: i) - 1;
        }
        this.suggestIndex = i;
        this.suggestText = this.formatTitle(this.suggestItems[this.suggestIndex]);
    }

    public tapSuggestion(i: number) {
        this.suggestionChosen.emit(i);
        this.searchService.emit('confirm', this.suggestItems[i]);
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
