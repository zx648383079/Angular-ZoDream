import { Component, OnInit, inject } from '@angular/core';
import { ForumService } from './forum.service';

@Component({
    standalone: false,
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {
    private readonly service = inject(ForumService);


    public isLoading = true;
    public data: any = {};

    ngOnInit() {
        this.service.statistics().subscribe(res => {
            this.isLoading = false;
            this.data = res;
        });
    }
}
