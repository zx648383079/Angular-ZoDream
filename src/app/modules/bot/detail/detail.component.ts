import { Component, HostListener, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { hasElementByClass } from '../../../theme/utils/doc';
import { BotService } from '../bot.service';
import { IBotMedia } from '../model';

@Component({
    standalone: false,
  selector: 'app-bot-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
    private service = inject(BotService);
    private route = inject(ActivatedRoute);
    private toastrService = inject(DialogService);


    public data: IBotMedia;
    public dropToggle = false;

    @HostListener('document:click', ['$event']) hideCalendar(event: any) {
        if (!event.target.closest('.rich_media_meta_nickname') && !hasElementByClass(event.path, 'drop-box')) {
            this.dropToggle = false;
        }
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.service.media({
                wid: params.wid,
                id: params.id
            }).subscribe({
                next: res => {
                    this.data = res;
                },
                error: err => {
                    this.toastrService.error(err);
                    history.back();
                }
            });
        });
    }

}
