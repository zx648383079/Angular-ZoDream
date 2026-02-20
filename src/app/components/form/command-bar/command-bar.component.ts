import { Component, HostListener, input, contentChildren, effect, signal, afterNextRender } from '@angular/core';
import { IButton } from '../event';
import { isParentOf } from '../../../theme/utils/doc';
import { CommandButtonComponent } from './command-button';

@Component({
    standalone: false,
    selector: 'app-command-bar',
    templateUrl: './command-bar.component.html',
    styleUrls: ['./command-bar.component.scss']
})
export class CommandBarComponent {

    public readonly items = contentChildren(CommandButtonComponent);
    public readonly max = input(3);
    public readonly min = input(1);
    public readonly flowLeft = input(false);
    public readonly dropVisible = signal(false);
    public readonly inlineItems = signal<IButton[]>([]);
    public readonly dropItems = signal<IButton[]>([]);

    constructor() {
        effect(() => {
            this.min();
            this.max();
            this.items();
            this.splitButton();
        });
        afterNextRender({
            write: () => {
                setTimeout(() => {
                    this.splitButton();
                }, 100);
            }
        });
    }

    @HostListener('document:click', ['$event']) 
    public hideDrop(event: MouseEvent) {
        if (isParentOf(event.target as Node, 'command-secondary-bar') < 0) {
            this.dropVisible.set(false);
        }
    }

    @HostListener('window:resize', [])
    public onResize() {
        this.splitButton();
    }


    public toggle(e?: MouseEvent) {
        e.stopPropagation();
        this.dropVisible.update(v => !v);
    }

    private splitButton() {
        const items = this.items().filter(i => !i.disabled);
        if (items.length < 1) {
            this.inlineItems.set([]);
            this.dropItems.set([]);
            return;
        }
        let i = this.min();
        if (window.innerWidth > 700) {
            i = this.max();
        }
        if (i > 0) {
            this.inlineItems.set(items.slice(0, i));
            this.dropItems.set(items.slice(i));
        } else {
            this.inlineItems.set([]);
            this.dropItems.set(items);
        }
    }

    public tapItem(item: IButton) {
        if (item.disabled) {
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
