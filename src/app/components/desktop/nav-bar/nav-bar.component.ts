import { Component, OnInit, OnDestroy, inject, input, output, model, computed, signal } from '@angular/core';
import { ThemeService } from '../../../theme/services';
import { INavLink } from '../../../theme/models/seo';
import { SuggestChangeEvent } from '../../form';
import { Subscription } from 'rxjs';
import { NavigationDisplayMode } from '../../../theme/models/event';



@Component({
    standalone: false,
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, OnDestroy, SuggestChangeEvent {
    private readonly themeService = inject(ThemeService);


    public readonly displayMode = signal<NavigationDisplayMode>(0); // 0 为展开 1 为 一条线 2 为 一个点 3 为不显示
    public readonly isPaneOverlay = signal(false);
    public readonly suggestIndex = signal(-1);
    public readonly menu = input<INavLink[]>([]);
    public readonly bottomMenu = input<INavLink[]>([]);
    public readonly hasSuggest = input(false);
    public readonly suggestItems = model<any[]>([]);
    public readonly textChanged = output<SuggestChangeEvent>();
    public readonly querySubmitted = output<any>();
    public readonly suggestionChosen = output<number>();

    public readonly suggestText = signal('');

    private readonly subItems = new Subscription();

    ngOnInit() {
        this.subItems.add(
            this.themeService.navigationDisplayRequest.subscribe(res => {
                this.displayMode.set(typeof res === 'number' ? res : 0);
            }),
        );
        this.subItems.add(this.themeService.tabletChanged.subscribe(isTablet => {
            this.isPaneOverlay.set(isTablet);
            this.displayMode.set(isTablet ? NavigationDisplayMode.Collapse : NavigationDisplayMode.Inline);
            this.emitResize();
        }));
    }

    ngOnDestroy() {
        this.subItems.unsubscribe();
    }

    public readonly tabletItems = computed(() => {
        const items: INavLink[] = [];
        for (const item of this.menu()) {
            if (item.tabletEnabled) {
                items.push(item);
            }
        }
        if (items.length === 0 && this.menu().length > 0) {
            items.push(this.menu()[0]);
        }
        return items;
    });

    public get text() {
        return this.suggestText();
    }

    public suggest(items: any[]): void {
        this.suggestIndex.set(-1);
        this.suggestItems.set(items);
    }

    public formatTitle(item: any) {
        if (typeof item !== 'object') {
            return item;
        }
        return item.title || item.name;
    }

    public readonly navClass = computed(() => {
        switch(this.displayMode()) {
            case NavigationDisplayMode.Overlay:
                return '--pane-overlay';
            case NavigationDisplayMode.Compact:
                return '--pane-compact';
            case NavigationDisplayMode.Toggle:
                return '--pane-toggle';
            case NavigationDisplayMode.Collapse:
                return '--pane-collapse';
            case NavigationDisplayMode.ToggleOverlay:
                return '--pane-toggle-overlay';
            default:
                return '';
        }
    });

    public tapToggle() {
        this.displayMode.update(v => {
            if (this.themeService.tabletChanged.value) {
                return v !== NavigationDisplayMode.Collapse ? NavigationDisplayMode.Collapse : NavigationDisplayMode.Overlay;
            } else {
                return this.paneDisplayNext(v);
            }
        });
        
        this.emitResize();
    }

    private paneDisplayNext(mode: NavigationDisplayMode): NavigationDisplayMode {
        switch (mode) 
        {
            case NavigationDisplayMode.Inline:
                return NavigationDisplayMode.Compact;
            case NavigationDisplayMode.Compact:
                return NavigationDisplayMode.Toggle;
            default:
                return NavigationDisplayMode.Inline;
        }
    }

    private emitResize() {
        this.themeService.navigationChanged.next({
            mode: this.displayMode(), 
            paneWidth: [200, 50, 0][this.displayMode()], 
            bodyWidth: this.themeService.bodyWidth
        });
    }

    public tapSuggest() {
        this.displayMode.set(0);
        this.querySubmitted.emit(this.suggestText);
    }

    public suggestKeyPress(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            const item = this.suggestIndex() >= 0 ? this.suggestItems()[this.suggestIndex()] : this.suggestText;
            this.themeService.suggestQuerySubmitted.next(item);
            this.querySubmitted.emit(item);
            return;
        }
        
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') {
            this.suggestIndex.set(-1);
            this.textChanged.emit(this);
            return;
        }
        if (this.suggestItems().length < 0) {
            return;
        }
        let i = this.suggestIndex();
        if (e.key === 'ArrowDown') {
            i = i < this.suggestItems().length - 1 ? i + 1 : 0;
        } else if (e.key === 'ArrowUp') {
            i = (i < 1 ? this.suggestItems().length: i) - 1;
        }
        this.suggestIndex.set(i);
        this.suggestText.set(this.formatTitle(this.suggestItems()[this.suggestIndex()]));
    }

    public tapSuggestion(i: number) {
        this.suggestionChosen.emit(i);
        this.themeService.suggestQuerySubmitted.next(this.suggestItems()[i]);
    }

    public tapItem(item: INavLink, e: MouseEvent) {
        e.stopPropagation();
        this.isActive(this.menu(), item);
        this.isActive(this.bottomMenu(), item);
    }

    private isActive(items: INavLink[], current: INavLink) {
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
