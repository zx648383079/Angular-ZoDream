import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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

    public navExpand = false;

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        
    }

}
