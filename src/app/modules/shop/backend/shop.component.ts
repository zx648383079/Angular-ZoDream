import {
    Component,
    OnInit
} from '@angular/core';
import {
    Observable
} from 'rxjs';
import {
    ISubtotal,
    ShopService
} from './shop.service';
import {
    EChartsOption
} from 'echarts';
import {
    map
} from 'rxjs/operators';

@Component({
    selector: 'app-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

    public items: ISubtotal[];

    public options: Observable < EChartsOption > ;

    constructor(
        private service: ShopService
    ) {
        this.service.statistics().subscribe(res => {
            this.items = res;
        });
        this.options = this.service.order().pipe(map<any[], EChartsOption>(data => {
            return {
                title: {
                    text: '订单月统计',
                    left: 'center',
                    align: 'right'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['订单数', '订单金额'],
                    left: 10,
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: data.map(item => item.date),
                },
                yAxis: [
                    {
                        name: '数量(个)',
                        type: 'value',
                    },
                    {
                        name: '金额(元)',
                        nameLocation: 'start',
                        type: 'value',
                        // inverse: true
                    }
                ],
                series: [
                    {
                        name: '订单数',
                        type: 'line',
                        animation: false,
                        data: data.map(item => item.count),
                    },
                    {
                        name: '订单金额',
                        type: 'line',
                        yAxisIndex: 1,
                        animation: false,
                        data: data.map(item => item.total),
                    }
                ]
            };
        }));
    }

    ngOnInit(): void {}

}