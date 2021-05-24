import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-news',
  templateUrl: './edit-news.component.html',
  styleUrls: ['./edit-news.component.scss']
})
export class EditNewsComponent implements OnInit {

    public onlyItems = ['所有人', '粉丝'];

    constructor() { }

    ngOnInit() {
    }

}
