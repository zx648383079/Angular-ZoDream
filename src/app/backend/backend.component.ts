import { Component, OnInit } from '@angular/core';
import { INav } from '../theme/components';
import { AppState } from '../theme/interfaces';
import { Store } from '@ngrx/store';
import { getCurrentUser } from '../theme/reducers/selectors';
import { BackendService } from './backend.service';
import { IUserRole } from '../theme/models/auth';

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
      url: './user/profile',
      children: [
        {
          name: '消息',
          label: '消',
          url: './user/bulletin'
        },
        {
          name: '账户关联',
          label: '联',
          url: './user/connect'
        },
        {
          name: '操作记录',
          label: '操',
          url: './user/log'
        },
        {
          name: '登录记录',
          label: '登',
          url: './user/login-log'
        },
        {
          name: '修改密码',
          label: '密',
          url: './user/password'
        }
      ]
    },
    {
      name: '会员管理',
      icon: 'icon-group',
      url: './auth',
      children: [
        {
          name: '会户列表',
          label: '会',
          url: './auth/users'
        },
        {
          name: '角色权限',
          label: '角',
          url: './auth/role'
        },
        {
          name: '第三方管理',
          label: '三',
          url: './auth/oauth'
        },
        {
          name: '账户申请日志',
          label: '申',
          url: './auth/users/apply/log'
        },
        {
          name: '账户日志',
          label: '账',
          url: './auth/users/account/log'
        },
        {
          name: '会员操作日志',
          label: '操',
          url: './auth/users/action/log'
        },
        {
          name: '管理员日志',
          label: '管',
          url: './auth/admin/log'
        },
      ]
    },
    {
      name: '博客',
      icon: 'icon-file-text-o',
      url: './blog',
      children: [
        {
          name: '列表',
          label: '列',
          url: './blog/list',
        },
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
    },
    {
      name: '商城',
      icon: 'icon-desktop',
      url: './shop',
      children: [
        {
          name: '商品列表',
          label: '商',
          url: './shop/goods/list'
        },
        {
          name: '分类列表',
          label: '类',
          url: './shop/goods/category'
        },
        {
          name: '品牌列表',
          label: '品',
          url: './shop/goods/brand'
        },
        {
          name: '商品类型',
          label: '型',
          url: './shop/goods/group'
        },
        {
          name: '营销管理',
          label: '营',
          url: './shop/activity'
        },
        {
          name: '订单管理',
          label: '单',
          url: './shop/order'
        },
        {
          name: '文章管理',
          label: '文',
          url: './shop/article'
        },
        {
          name: '广告管理',
          label: '告',
          url: './shop/ad'
        },
        {
          name: '地区管理',
          label: '区',
          url: './shop/region'
        },
        {
          name: '插件管理',
          label: '插',
          url: './shop/plugin'
        },
        {
          name: '支付管理',
          label: '付',
          url: './shop/payment'
        },
        {
          name: '配送管理',
          label: '配',
          url: './shop/shipping'
        }
      ]
    },
    {
      name: '开放平台',
      icon: 'icon-th-large',
      url: './open',
      children: [
        {
          name: '应用管理',
          label: '应',
          url: './open/platform',
        },
        {
          name: '授权管理',
          label: '授',
          url: './open/authorize',
        },
      ],
    },
    {
      name: '短信管理',
      icon: 'icon-mail',
      url: './sms',
      children: [
        {
          name: '签名管理',
          label: '签',
          url: './sms/signature',
        },
        {
          name: '模板管理',
          label: '模',
          url: './sms/template',
        },
        {
          name: '记录管理',
          label: '录',
          url: './sms/log',
        },
        {
          name: '短信配置',
          label: '置',
          url: './sms/option',
        },
      ],
    },
    {
      name: '系统设置',
      icon: 'icon-cog',
      url: './system',
      children: [
        {
          name: '反馈留言',
          label: '馈',
          url: './contact/feedback',
        },
        {
          name: '友情链接',
          label: '链',
          url: './contact/friend-link',
        },
        {
          name: '订阅',
          label: '订',
          url: './contact/subscribe',
        },
        {
          name: '缓存',
          label: '缓',
          url: './system/cache',
        },
        {
          name: 'SiteMap',
          label: 'Map',
          url: './system/sitemap',
        },
        {
          name: '数据备份',
          label: '备',
          url: './system/sql',
        },
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

  constructor(
    private store: Store<AppState>,
    private service: BackendService) {
    this.store.select(getCurrentUser).subscribe(user => {
      this.bottomNavs[0].name = user.name;
    });
    this.service.roles().subscribe(res => {
      this.navItems = this.service.filterNavByRole(this.navItems, res);
      this.bottomNavs = this.service.filterNavByRole(this.bottomNavs, res);
    });
  }

  ngOnInit(): void {
  }

}
