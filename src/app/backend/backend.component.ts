import { Component, OnInit } from '@angular/core';
import { INav } from '../theme/components';



@Component({
  selector: 'app-backend',
  templateUrl: './backend.component.html',
  styleUrls: ['./backend.component.scss']
})
export class BackendComponent implements OnInit {

  public navItems: INav[] = [
    {
      name: '首页',
      icon: 'icon-home',
      url: '/backend'
    }
  ];

  public bottomNavs: INav[] = [
    {
      name: 'zodream',
      icon: 'icon-user'
    },
    {
      name: '设置',
      icon: 'icon-cog'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
