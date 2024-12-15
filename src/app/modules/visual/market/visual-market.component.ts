import { Component, OnInit } from '@angular/core';
import { INav } from '../../../theme/components';
import { VisualService } from './visual.service';

@Component({
    standalone: false,
  selector: 'app-visual-market',
  templateUrl: './visual-market.component.html',
  styleUrls: ['./visual-market.component.scss']
})
export class VisualMarketComponent implements OnInit {

    public navItems: INav[] = [
    ];

    constructor(
        private service: VisualService
    ) { }

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
