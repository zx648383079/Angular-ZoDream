import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { Observable, map } from 'rxjs';
import { TrendService } from '../trend.service';
import { TimeTabItems } from '../model';

@Component({
    selector: 'app-trend-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public trendToggle = false;
    public todayData: any = {};
    public options: Observable<EChartsOption>;
    public wordItems: any[] = [];
    public sourceItems: any[] = [];
    public enterItems: any[] = [];
    public pageItems: any[] = [];
    public tabItems = TimeTabItems;
    public tabIndex = 'today';

    constructor(
        private service: TrendService,
    ) { }

    ngOnInit() {
        this.service.batch({
            today: {}
        }).subscribe(res => {
            this.todayData = res.today;
        });
        this.options = this.service.trendStatistics().pipe(map(data => {
            return <EChartsOption>{
                // title: {
                //     text: '流量趋势分析',
                //     left: 'center',
                //     align: 'right'
                // },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['今日', '昨日'],
                    right: 10,
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: data.map(item => item.time),
                },
                yAxis: {
                        type: 'value',
                },
                series: [
                    {
                        name: '今日',
                        type: 'line',
                        animation: false,
                        data: data.map(item => item.count),
                    },
                    {
                        name: '昨日',
                        type: 'line',
                        animation: false,
                        data: data.map(item => item.last),
                    }
                ]
            };
        }));
    }


    public tapTab(val: string) {
        this.tabIndex = val;
    }

    public loadWord() {
        
    }

    public loadSource() {
        
    }

    public loadEnter() {
        
    }

    public loadPage() {
        
    }
}
