import { Component } from '@angular/core';
import { AuthService } from './theme/services';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {
  title = 'Angular ZoDream';

  constructor(private auth: AuthService) {
    const loading = document.querySelector('.loading-theme') as HTMLDivElement;
    if (loading) {
      loading.style.display = 'none';
    }
    this.auth.loginFromStorage();
  }
}
