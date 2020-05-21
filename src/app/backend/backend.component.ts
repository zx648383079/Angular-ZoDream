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
      url: './'
    },
    {
      name: '我的',
      icon: 'icon-user',
      url: './auth/profile',
      children: [
        {
          name: '消息',
          label: '消',
          url: './auth/bulletin'
        },
        {
          name: '账户关联',
          label: '联',
          url: './auth/connect'
        },
        {
          name: '操作记录',
          label: '操',
          url: './auth/log'
        },
        {
          name: '登录记录',
          label: '登',
          url: './auth/login-log'
        },
        {
          name: '修改密码',
          label: '密',
          url: './auth/password'
        }
      ]
    },
    {
      name: '用户',
      icon: 'icon-group',
      url: './auth',
      children: [
        {
          name: '权限',
          label: '限',
          url: './auth/role'
        }
      ]
    },
    {
      name: '博客',
      icon: 'icon-file-text-o',
      url: './blog',
      children: [
          {
            name: '分类',
            label: '类',
            url: './blog/category',
          },
          {
            name: '标签',
            label: '签',
            url: './blog/tag',
          },
          {
            name: '评论',
            label: '评',
            url: './blog/comment',
          }
      ]
    }
  ];

  public bottomNavs: INav[] = [
    {
      name: 'zodream',
      icon: 'icon-user',
      url: './auth/profile'
    },
    {
      name: '设置',
      icon: 'icon-cog',
      url: './system'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
