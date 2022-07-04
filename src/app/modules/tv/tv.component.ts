import { Component, OnInit } from '@angular/core';
import { INav } from '../../theme/components';

@Component({
  selector: 'app-tv',
  templateUrl: './tv.component.html',
  styleUrls: ['./tv.component.scss']
})
export class TvComponent implements OnInit {

    public items: INav[] = [
        {
            name: $localize `Home`,
            url: './',
        },
        {
            name: $localize `Movie`,
            url: 'movie',
        },
        {
            name: $localize `Teleplay`,
            url: 'teleplay',
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
