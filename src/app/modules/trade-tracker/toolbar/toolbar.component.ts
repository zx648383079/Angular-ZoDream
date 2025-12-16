import { Component, signal } from '@angular/core';
import { ITradeLog } from '../model';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-trade-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {

    public visible = false;
    public title = 'Toolbar';

    public readonly dataForm = form(signal({
        buyPrice: 0,
        discount: 0,
        sellPrice: 0,
        buyRate: 0, // 买的手续费
        sellRate: 0, // 买的手续费
    }));

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
        this.dataForm().value.update(v => {
            for (const key in v) {
                if (Object.prototype.hasOwnProperty.call(v, key) && key.indexOf('Rate') < 0) {
                    v[key] = 0;
                }
            }
            return v;
        });
        
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
        this.dataForm().value.update(v => {
            if (!v[key] || !v[target]) {
                return;
            }
            const items = ['buyPrice', 'discount', 'sellPrice'];
            const i = 3 - items.indexOf(key) - items.indexOf(target);
            if (i < 1) {
                v.buyPrice = v.sellPrice * (1 - v.sellRate) * v.discount / ( 1 - v.buyRate);
            } else if (i == 1) {
                v.discount = v.buyPrice * ( 1 - v.buyRate) / (v.sellPrice * (1 - v.sellRate));
            } else {
                v.sellPrice = v.buyPrice * ( 1 - v.buyRate) / v.discount / (1 - v.sellRate);
            }
            return v;
        });
        
    }

    private changePrice(name: string, price: number) {
        this.changeRate(name);
        this.matchKey = this.lastKey = name === 'steam' ? 'sellPrice' : 'buyPrice';
        this.dataForm().value.update(v => {
            v[this.lastKey] = price;
            v[this.lastKey !== 'sellPrice' ? 'sellPrice' : 'buyPrice'] = 0;
            return v;
        });
    }

    private changeRate(name: string) {
        if (['steam', 'buff', 'uuyp', 'c5'].indexOf(name) >= 0) {
            this.dataForm().value.update(v => {
                v.buyRate = 0;
                v.sellRate = .15;
                return v;
            });
        }
    }
}
