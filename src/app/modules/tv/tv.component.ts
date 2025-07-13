import { Component, OnInit } from '@angular/core';
import { INavLink } from '../../theme/models/seo';


@Component({
    standalone: false,
  selector: 'app-tv',
  templateUrl: './tv.component.html',
  styleUrls: ['./tv.component.scss']
})
export class TvComponent implements OnInit {

    public items: INavLink[] = [
        {
            name: $localize `Home`,
            url: './',
        },
        {
            name: $localize `Movie`,
            url: 'category/1',
        },
        {
            name: $localize `Teleplay`,
            url: 'category/2',
        },
        {
            name: $localize `Music`,
            url: 'music',
        },
        {
            name: $localize `Live`,
            url: 'live',
        },
    ];

    constructor() { }

    ngOnInit() {
    }

}
