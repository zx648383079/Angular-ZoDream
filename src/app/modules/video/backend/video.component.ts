import { Component, OnInit } from '@angular/core';
import { VideoService } from './video.service';

@Component({
    standalone: false,
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

    public isLoading = false;
    public data: any = {};

    constructor(
        private service: VideoService
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
