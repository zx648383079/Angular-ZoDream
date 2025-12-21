import { Component, OnInit, inject, signal } from '@angular/core';
import { BotService } from './bot.service';

@Component({
    standalone: false,
    selector: 'app-bot-backend',
    templateUrl: './bot-backend.component.html',
    styleUrls: ['./bot-backend.component.scss']
})
export class BotBackendComponent implements OnInit {
    private readonly service = inject(BotService);


    public readonly isLoading = signal(false);
    public readonly data = signal<any>({});

    ngOnInit() {
        this.service.statistics().subscribe({
            next: res => {
                this.data.set(res);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

}
