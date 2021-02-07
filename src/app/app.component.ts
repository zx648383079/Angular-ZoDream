import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivationEnd, NavigationEnd, Router } from '@angular/router';
import { AuthService } from './theme/services';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  encapsulation: ViewEncapsulation.None // Emulated当前  None全局
})
export class AppComponent implements OnInit {
    title = 'Angular ZoDream';

    constructor(
        private auth: AuthService,
        private router: Router,
    ) {
        const loading = document.querySelector('.loading-theme') as HTMLDivElement;
        if (loading) {
            loading.style.display = 'none';
        }
        this.auth.loginFromStorage();
        this.auth.loginFromCookie();
    }

    ngOnInit() {
        this.router.events.subscribe((event: NavigationEnd) => {
            if (event instanceof ActivationEnd) {// 当导航成功结束时执行
                document.documentElement.scrollTop = 0;
            }
        });
    }
}
