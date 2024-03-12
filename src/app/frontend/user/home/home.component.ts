import { Component, OnInit } from '@angular/core';
import { IStatisticsItem } from '../../../theme/models/seo';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { openLink } from '../../../theme/utils/deeplink';

@Component({
    selector: 'app-user-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public items: IStatisticsItem[] = [];
    public isLoading = true;

    constructor(
        private service: UserService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.service.statistics().subscribe({
            next: res => {
                this.items = res.data;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }


    public tapItem(item: any) {
        if (!item.url) {
            return;
        }
        openLink(this.router, item.url);
    }
}
