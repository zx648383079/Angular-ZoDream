import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IExtraRule } from '../../link-rule';
import { ISite, IWebPage } from '../model';
import { formatDomain } from '../util';

@Component({
  selector: 'app-page-container',
  templateUrl: './page-container.component.html',
  styleUrls: ['./page-container.component.scss']
})
export class PageContainerComponent implements OnChanges {

    @Input() public value: IWebPage;
    public rules: IExtraRule[] = [];
    public menuItems = [$localize `Collect`, $localize `Share`, $localize `Report`];
    public menuOpen = false;

    @Output() public onAction = new EventEmitter<{
        type: number,
        data: IWebPage,
    }>();

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.value) {
            this.rules = this.value.keywords ? this.value.keywords.map(i => {
                return {
                    s: i.word,
                    type: 9
                };
            }) : [];
        }
    }

    public formatDomain(v: string) {
        return formatDomain(v);
    }

    public formatLink(item: ISite): string {
        return `${item.schema}://${item.domain}`;
    }

    public tapMenu(i: number) {
        this.onAction.emit({
            type: i,
            data: this.value,
        });
    }


}
