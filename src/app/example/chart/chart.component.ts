import { Component, OnInit } from '@angular/core';
import { EChartsCoreOption } from 'echarts/core';
import { Observable, map, of } from 'rxjs';
import { randomInt } from '../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-example-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss']
})
export class ExampleChartComponent implements OnInit {

    public options: Observable<EChartsCoreOption> ;
    
    ngOnInit() {
        const items = [];
        for (let i = 0; i < 20; i++) {
            items.push({
                date: '2013-07-' + i,
                count: randomInt(0, 3000),
                total: randomInt(0, 50000)
            });
        }
        this.options = of(items).pipe(map<any[], EChartsCoreOption>(data => {
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

}
