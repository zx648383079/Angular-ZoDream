import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FrontendService, ILink } from './frontend.service';

interface IMenuItem {
  name: string;
  url: string;
}

@Component({
  selector: 'app-frontend',
  templateUrl: './frontend.component.html',
  styleUrls: ['./frontend.component.scss']
})
export class FrontendComponent implements OnInit {

    public menus: IMenuItem[] = [
        {name: 'Home', url: 'home'},
        {name: 'Blog', url: 'blog'},
        {name: 'Friend Link', url: 'friend_link'},
        {name: 'Abount', url: 'about'}
    ];

    public friendLinks: ILink[] = [];

    public navExpand = false;

    public activeUri = '';

    constructor(
        private service: FrontendService,
        private router: Router) {
        this.service.friendLinks().subscribe(res => {
            this.friendLinks = res;
        });
        this.router.events.subscribe(event => {
          if (event instanceof NavigationEnd) {
            this.routerChanged(event.url);
          }
        });
    }

    ngOnInit(): void {
    }

    private routerChanged(url: string) {
      for (const item of ['about', 'friend_link', 'blog']) {
        if (url.indexOf(item) > 0) {
          this.activeUri = item;
          return;
        }
      }
      this.activeUri = '';
    }

}
