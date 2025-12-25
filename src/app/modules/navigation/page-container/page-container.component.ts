import { Component, effect, input, output, signal, untracked } from '@angular/core';
import { IExtraRule } from '../../../components/link-rule';
import { ISite, IWebPage } from '../model';
import { formatDomain } from '../util';

@Component({
    standalone: false,
    selector: 'app-navigation-page-container',
    templateUrl: './page-container.component.html',
    styleUrls: ['./page-container.component.scss']
})
export class PageContainerComponent {

    public readonly value = input<IWebPage>(undefined);
    public readonly rules = signal<IExtraRule[]>([]);
    public menuItems = [$localize `Collect`, $localize `Share`, $localize `Report`];
    public readonly menuOpen = signal(false);

    public readonly onAction = output<{
        type: number;
        data: IWebPage;
    }>();

    constructor() {
        effect(() => {
            const value = this.value();
            untracked(() => {
                this.rules.set(value.keywords ? value.keywords.map(i => {
                    return {
                        s: i.word,
                        type: 9
                    };
                }) : []);
            });
            
        });
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
