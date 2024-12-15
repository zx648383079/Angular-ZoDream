import { Component, OnInit } from '@angular/core';
import { BotService } from './bot.service';

@Component({
    standalone: false,
  selector: 'app-bot-backend',
  templateUrl: './bot-backend.component.html',
  styleUrls: ['./bot-backend.component.scss']
})
export class BotBackendComponent implements OnInit {

    public isLoading = false;
    public data: any = {};

    constructor(
        private service: BotService
    ) { }

    ngOnInit() {
        this.service.statistics().subscribe({
            next: res => {
                this.data = res;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
