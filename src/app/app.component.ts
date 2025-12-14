import { Component, DOCUMENT, OnInit, Renderer2, ViewEncapsulation, inject } from '@angular/core';
import { ActivationEnd, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from './theme/interfaces';
import { selectSystemConfig } from './theme/reducers/system.selectors';
import { AuthService, ThemeService } from './theme/services';

@Component({
    standalone: false,
    selector: 'app-root',
    template: `<router-outlet />
                <app-dialog-container />`,
    encapsulation: ViewEncapsulation.None // Emulated当前  None全局
})
export class AppComponent implements OnInit {
    private auth = inject(AuthService);
    private readonly router = inject(Router);
    private readonly store = inject<Store<AppState>>(Store);
    private readonly themeService = inject(ThemeService);
    private renderer = inject(Renderer2);
    private document = inject<Document>(DOCUMENT);


    ngOnInit() {
        this.auth.systemBoot();
        const loading = this.document.querySelector('.loading-theme');
        if (loading) {
            this.renderer.setStyle(loading, "display", "none");
        }
        const queryFn = window.matchMedia('(min-width: 48rem)');
        this.onResize(queryFn);
        queryFn.addEventListener('change', () => this.onResize(queryFn));
        this.store.select(selectSystemConfig).subscribe(res => {
            this.themeService.toggleClass('theme-gray', res && res.site_gray == true);
        });
        this.router.events.subscribe((event: NavigationEnd) => {
            if (event instanceof ActivationEnd) {// 当导航成功结束时执行
                document.documentElement.scrollTop = 0;
            }
        });
    }

    private onResize(queryFn: MediaQueryList) {
        this.themeService.tabletChanged.next(!queryFn.matches);
    }
}
