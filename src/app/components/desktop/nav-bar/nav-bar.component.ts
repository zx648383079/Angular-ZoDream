import { Component, inject, input, output, model, computed, signal, DestroyRef, effect } from '@angular/core';
import { ThemeService } from '../../../theme/services';
import { INavLink } from '../../../theme/models/seo';
import { SuggestChangeEvent } from '../../form';
import { asyncScheduler, Subject, throttleTime } from 'rxjs';
import { NavigationDisplayMode } from '../../../theme/models/event';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
    standalone: false,
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements SuggestChangeEvent {
    private readonly destroyRef = inject(DestroyRef);
    private readonly themeService = inject(ThemeService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);


    public readonly displayMode = signal<NavigationDisplayMode>(0); // 0 为展开 1 为 一条线 2 为 一个点 3 为不显示
    public readonly isPaneOverlay = signal(false);
    public readonly suggestIndex = signal(-1);
    public readonly menu = input<INavLink[]>([]);
    public readonly bottomMenu = input<INavLink[]>([]);

    public readonly tabletItems = signal<INavLink[]>([]);

    public readonly hasSuggest = input(false);
    public readonly suggestItems = model<any[]>([]);
    public readonly textChanged = output<SuggestChangeEvent>();
    public readonly querySubmitted = output<any>();
    public readonly suggestionChosen = output<number>();
    public readonly suggestText = signal('');
    public readonly suggestHovered = signal(false);
    private readonly $textChanged = new Subject<void>();

    /**
     *
     */
    constructor() {
        effect(() => {
            this.syncTablet(this.menu());
        });
        this.themeService.navigationDisplayRequest.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
            this.displayMode.set(typeof res === 'number' ? res : 0);
        });
        this.themeService.tabletChanged.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(isTablet => {
            this.isPaneOverlay.set(isTablet);
            this.displayMode.set(isTablet ? NavigationDisplayMode.BottomOverlay : NavigationDisplayMode.Inline);
            this.emitResize();
        })
        this.$textChanged.pipe(
            throttleTime(500, asyncScheduler, { leading: false, trailing: true }),
            takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(() => {
            this.textChanged.emit(this);
        });
    }

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
            case NavigationDisplayMode.BottomOverlay:
                return '--pane-bottom-overlay';
            default:
                return '';
        }
    });

    public tapToggle() {
        this.displayMode.update(v => {
            if (this.themeService.tabletChanged.value) {
                return v !== NavigationDisplayMode.BottomOverlay ? NavigationDisplayMode.BottomOverlay : NavigationDisplayMode.Overlay;
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
        this.querySubmitted.emit(this.suggestText());
    }

    public suggestKeyPress(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            const item = this.suggestIndex() >= 0 ? this.suggestItems()[this.suggestIndex()] : this.suggestText();
            this.themeService.suggestQuerySubmitted.next(item);
            this.querySubmitted.emit(item);
            return;
        }
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') {
            this.suggestIndex.set(-1);
            this.$textChanged.next();
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
        this.suggestIndex.set(i);
        this.suggestionChosen.emit(i);
        this.themeService.suggestQuerySubmitted.next(this.suggestItems()[i]);
    }

    public tapItem(item: INavLink, e: MouseEvent, jumpTo = false) {
        e.stopPropagation();
        const items = this.menu();
        this.isActive(items, item);
        this.isActive(this.bottomMenu(), item);
        this.syncTablet(items);
        if (jumpTo) {
            this.router.navigate([item.url], {queryParams: item.urlQuery ?? {}, relativeTo: this.route});
        }
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

    private syncTablet(data: INavLink[]) {
        const items: INavLink[] = [];
        for (const item of data) {
            if (item.tabletEnabled) {
                items.push(item);
            }
        }
        if (items.length === 0 && data.length > 0) {
            items.push(data[0]);
        }
        this.tabletItems.set(items);
    }
}
