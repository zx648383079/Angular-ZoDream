import { Component, OnChanges, SimpleChanges, input, output } from '@angular/core';
import { IExtraRule } from '../../../components/link-rule';
import { ISite, IWebPage } from '../model';
import { formatDomain } from '../util';

@Component({
    standalone: false,
  selector: 'app-navigation-page-container',
  templateUrl: './page-container.component.html',
  styleUrls: ['./page-container.component.scss']
})
export class PageContainerComponent implements OnChanges {

    public readonly value = input<IWebPage>(undefined);
    public rules: IExtraRule[] = [];
    public menuItems = [$localize `Collect`, $localize `Share`, $localize `Report`];
    public menuOpen = false;

    public readonly onAction = output<{
    type: number;
    data: IWebPage;
}>();

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.value) {
            const value = this.value();
            this.rules = value.keywords ? value.keywords.map(i => {
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
            data: this.value(),
        });
    }


}
