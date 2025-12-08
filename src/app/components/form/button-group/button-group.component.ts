import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { hasElementByClass } from '../../../theme/utils/doc';
import { ButtonEvent, ButtonGroupEvent, IButton } from '../event';

@Component({
    standalone: false,
  selector: 'app-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.scss']
})
export class ButtonGroupComponent implements ButtonEvent, OnChanges {

    @Input() public items: IButton[] = [];
    @Input() public max = 2;
    @Input() public min = 0;
    public dropVisible = false;
    public isLoading = false;
    public inlineItems: IButton[] = [];
    public dropItems: IButton[] = [];
    @Output() public tapped = new EventEmitter<ButtonGroupEvent>();

    @HostListener('document:click', ['$event']) 
    public hideDrop(event: any) {
        if (!event.target.closest('.btn-group-custom') && !hasElementByClass(event.path, 'dropdown-menu')) {
            this.dropVisible = false;
        }
    }

    @HostListener('window:resize', [])
    public onResize() {
        this.splitButton();
    } 

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.items || changes.min || changes.max) {
            this.splitButton();
        }
    }

    private splitButton() {
        const items = this.items.filter(i => !i.disable);
        if (items.length < 1) {
            this.inlineItems = [];
            this.dropItems = [];
            return;
        }
        let i = this.min;
        if (window.innerWidth > 700) {
            i = this.max;
        }
        if (i > 0) {
            this.inlineItems = items.slice(0, i);
            this.dropItems = items.slice(i);
        } else {
            this.inlineItems = [];
            this.dropItems = items;
        }
    }

    public tapItem(item: IButton) {
        if (item.disable) {
            return;
        }
        if (item.onTapped) {
            item.onTapped(this);
            return;
        }
        for (let i = 0; i < this.items.length; i++) {
            const element = this.items[i];
            if (element === item) {
                this.tapped.emit({
                    data: item,
                    index: i,
                    enter: this.enter.bind(this),
                    reset: this.reset.bind(this)
                });
                return;
            }
        }
    }

    
    /**
     * 开始执行加载
     */
    public enter() {
        this.isLoading = true;
    }

    /**
     * 停止执行
     */
    public reset() {
        this.isLoading = false;
    }
}
