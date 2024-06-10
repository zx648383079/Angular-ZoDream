import { Component } from '@angular/core';
import { ITradeLog } from '../model';
import { DialogAnimation } from '../../../theme/constants';

@Component({
    selector: 'app-trade-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    animations: [
        DialogAnimation,
    ],
})
export class ToolbarComponent {

    public visible = false;
    public title = 'Toolbar';

    public data = {
        buyPrice: 0,
        discount: 0,
        sellPrice: 0,
        buyRate: 0, // 买的手续费
        sellRate: 0, // 买的手续费
    };

    private matchKey = '';
    private lastKey = '';

    public open(item: ITradeLog) {
        this.visible = true;
        this.changePrice(item.channel.short_name, item.price);
    }

    public close() {
        this.visible = false;
    }

    public tapReset() {
        for (const key in this.data) {
            if (Object.prototype.hasOwnProperty.call(this.data, key) && key.indexOf('Rate') < 0) {
                this.data[key] = 0;
            }
        }
    }

    public onPriceChange(key: string) {
        if (key !== this.lastKey) {
            this.matchKey = this.lastKey;
            this.lastKey = key;
        }
        this.changeData(this.matchKey, this.lastKey);
    }

    private changeData(key: string, target: string)
    {
        if (key === target) {
            return;
        }
        if (!this.data[key] || !this.data[target]) {
            return;
        }
        const items = ['buyPrice', 'discount', 'sellPrice'];
        const i = 3 - items.indexOf(key) - items.indexOf(target);
        if (i < 1) {
            this.data.buyPrice = this.data.sellPrice * (1 - this.data.sellRate) * this.data.discount / ( 1 - this.data.buyRate);
        } else if (i == 1) {
            this.data.discount = this.data.buyPrice * ( 1 - this.data.buyRate) / (this.data.sellPrice * (1 - this.data.sellRate));
        } else {
            this.data.sellPrice = this.data.buyPrice * ( 1 - this.data.buyRate) / this.data.discount / (1 - this.data.sellRate);
        }
    }

    private changePrice(name: string, price: number) {
        this.changeRate(name);
        this.matchKey = this.lastKey = name === 'steam' ? 'sellPrice' : 'buyPrice';
        this.data[this.lastKey] = price;
        this.data[this.lastKey !== 'sellPrice' ? 'sellPrice' : 'buyPrice'] = 0;
    }

    private changeRate(name: string) {
        if (['steam', 'buff', 'uuyp', 'c5'].indexOf(name) >= 0) {
            this.data.buyRate = 0;
            this.data.sellRate = .15;
        }
    }
}
