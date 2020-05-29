import { Component, OnInit } from '@angular/core';
import { IForum } from 'src/app/theme/models/forum';
import { ForumService } from '../forum.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public items: IForum[] = [];

  constructor(
    private service: ForumService
  ) { }

  ngOnInit() {
    this.service.getForumList().subscribe(res => {
      this.items = res;
    });
  }

}
