import { Component, DOCUMENT, Inject, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { ActivationEnd, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from './theme/interfaces';
import { selectSystemConfig } from './theme/reducers/system.selectors';
import { AuthService, ThemeService } from './theme/services';

@Component({
    standalone: false,
    selector: 'app-root',
    template: `<router-outlet></router-outlet>
                <app-dialog-container></app-dialog-container>`,
    encapsulation: ViewEncapsulation.None // Emulated当前  None全局
})
export class AppComponent implements OnInit {

    constructor(
        private auth: AuthService,
        private router: Router,
        private store: Store<AppState>,
        private themeService: ThemeService,
        private renderer: Renderer2,
        @Inject(DOCUMENT) private document: Document
    ) {
        
    }

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
