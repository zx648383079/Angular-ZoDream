import { Component, OnInit, inject, signal } from '@angular/core';
import { IStatisticsItem } from '../../../theme/models/seo';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { openLink } from '../../../theme/utils/deeplink';

@Component({
    standalone: false,
    selector: 'app-user-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    private readonly service = inject(UserService);
    private readonly router = inject(Router);


    public readonly items = signal<IStatisticsItem[]>([]);
    public readonly isLoading = signal(true);

    ngOnInit() {
        this.service.statistics().subscribe({
            next: res => {
                this.items.set(res.data);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
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
