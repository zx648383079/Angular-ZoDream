import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivationEnd, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from './theme/interfaces';
import { selectSystemConfig } from './theme/reducers/system.selectors';
import { AuthService, ThemeService } from './theme/services';

@Component({
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
    ) {
        const loading = document.querySelector('.loading-theme') as HTMLDivElement;
        if (loading) {
            loading.style.display = 'none';
        }
        this.auth.systemBoot();
    }

    ngOnInit() {
        this.store.select(selectSystemConfig).subscribe(res => {
            this.themeService.toggleClass('theme-gray', res && res.site_gray);
        });
        this.router.events.subscribe((event: NavigationEnd) => {
            if (event instanceof ActivationEnd) {// 当导航成功结束时执行
                document.documentElement.scrollTop = 0;
            }
        });
    }
}
