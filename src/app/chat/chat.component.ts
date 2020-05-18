import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  /**
   * 在小尺寸下进入聊天界面
   */
  public roomMode = false;

  /**
   * 切换分组
   */
  public tabIndex = 0;
  /**
   * 进入搜索用户
   */
  public searchMode = false;

  public lastFriends = [1, 2, 3, 4, 5, 6, 6, 7, 9, 0, 0, 0, 0];

  public friends = [
    {
      name: '我的好友',
      expand: true,
      children: [
        1,
        2,
        3
      ]
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  public tapAdd(event: Event) {
    event.stopPropagation();
  }

  public tapUser(user: any) {
    this.roomMode = true;
  }

}
