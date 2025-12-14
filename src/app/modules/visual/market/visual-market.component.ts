import { Component, OnInit, inject } from '@angular/core';
import { INavLink } from '../../../theme/models/seo';
import { VisualService } from './visual.service';

@Component({
    standalone: false,
  selector: 'app-visual-market',
  templateUrl: './visual-market.component.html',
  styleUrls: ['./visual-market.component.scss']
})
export class VisualMarketComponent implements OnInit {
    private readonly service = inject(VisualService);


    public navItems: INavLink[] = [
    ];

    ngOnInit() {
        this.service.getNav().subscribe(res => {
            this.navItems = res.data.map(i => {
                return {
                    name: i.name,
                    url: 'category/' + i.id
                }
            });
        });
    }

}
