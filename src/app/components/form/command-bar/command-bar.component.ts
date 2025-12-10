import { AfterViewInit, Component, HostBinding, HostListener, OnChanges, SimpleChanges, input, contentChildren } from '@angular/core';
import { IButton } from '../event';
import { hasElementByClass } from '../../../theme/utils/doc';
import { CommandButtonComponent } from './command-button';

@Component({
    standalone: false,
    selector: 'app-command-bar',
    templateUrl: './command-bar.component.html',
    styleUrls: ['./command-bar.component.scss']
})
export class CommandBarComponent implements OnChanges, AfterViewInit {

    public readonly items = contentChildren(CommandButtonComponent);
    public readonly max = input(3);
    public readonly min = input(1);
    public readonly flowLeft = input(false);
    public dropVisible = false;
    public inlineItems: IButton[] = [];
    public dropItems: IButton[] = [];

    @HostListener('document:click', ['$event']) 
    public hideDrop(event: any) {
        if (!event.target.closest('.command-control-icon') && !hasElementByClass(event.path, 'command-secondary-bar')) {
            this.dropVisible = false;
        }
    }

    @HostListener('window:resize', [])
    public onResize() {
        this.splitButton();
    } 

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.min || changes.max) {
            this.splitButton();
        }
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.splitButton();
        }, 100);
        this.items().changes.subscribe(() => {
            this.splitButton();
        });
    }

    private splitButton() {
        const items = this.items().filter(i => !i.disable);
        if (items.length < 1) {
            this.inlineItems = [];
            this.dropItems = [];
            return;
        }
        let i = this.min();
        if (window.innerWidth > 700) {
            i = this.max();
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
    }

        
    /**
     * 开始执行加载
     */
    public enter() {
    }

    /**
     * 停止执行
     */
    public reset() {
    }
}
