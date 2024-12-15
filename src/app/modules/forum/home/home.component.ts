import { Component, OnInit } from '@angular/core';
import { IForum } from '../model';
import { ForumService } from '../forum.service';

@Component({
    standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public items: IForum[] = [];
    public isLoading = false;

    constructor(
        private service: ForumService
    ) { }

    ngOnInit() {
        this.isLoading = true;
        this.service.getForumList().subscribe({
            next: res => {
                this.items = res;
                this.isLoading = false;
            },
            error: _ => {
                this.isLoading = false;
            }
        });
    }

}
