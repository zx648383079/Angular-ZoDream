import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-friend-link',
  templateUrl: './friend-link.component.html',
  styleUrls: ['./friend-link.component.scss']
})
export class FriendLinkComponent implements OnInit {

  public items = [];

  constructor() { }

  ngOnInit() {
  }

}
