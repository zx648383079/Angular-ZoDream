import { Component, effect, inject, input, model, } from '@angular/core';
import { ISite } from '../../model';
import { NavigationService } from '../../navigation.service';

@Component({
    standalone: false,
    selector: 'app-navigation-site-group',
    templateUrl: './site-group.component.html',
    styleUrls: ['./site-group.component.scss']
})
export class SiteGroupComponent {
    private readonly service = inject(NavigationService);


    public readonly header = input($localize `Recommend`);

    public readonly items = model<ISite[]>([]);

    constructor() {
        // effect(() => {
        //     if (this.items().length > 0) {
        //         this.booted = this.category();
        //     }
        // });
        // effect(() => {
        //     if (this.init() && this.category() > 0 && this.booted !== this.category()) {
        //         this.boot();
        //     }
        // });
    }

    public formatLink(item: ISite): string {
        return `${item.schema}://${item.domain}`;
    }

    private boot() {
        // this.booted = this.category();
        // if (this.category() < 1) {
        //     return;
        // }
        
    }
}
