import { Component, Input, OnInit } from '@angular/core';
import { ISite, IWebPage } from '../model';
import { formatDomain } from '../util';

@Component({
  selector: 'app-page-container',
  templateUrl: './page-container.component.html',
  styleUrls: ['./page-container.component.scss']
})
export class PageContainerComponent {

    @Input() public value: IWebPage;

    constructor() { }

    public formatDomain(v: string) {
        return formatDomain(v);
    }

    public formatLink(item: ISite): string {
        return `${item.schema}://${item.domain}`;
    }
}
