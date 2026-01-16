import { Component, signal } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-example-buy',
    templateUrl: './buy.component.html',
    styleUrls: ['./buy.component.scss']
})
export class ExampleBuyComponent {

    public readonly typeItems: string[] = ['个人', '公司'];
    public readonly typeIndex = signal(0);


    public readonly paymentItems = [
        {
            name: '微信支付',
            icon: 'icon-wechat'
        },
        {
            name: 'QQ支付',
            icon: 'icon-qq'
        },
        {
            name: '微博支付',
            icon: 'icon-weibo'
        },
    ];
    public readonly paymentIndex = signal(0);
}
