import { Component, OnInit, inject, signal } from '@angular/core';
import { EChartsCoreOption } from 'echarts/core';
import { TrendService } from '../trend.service';
import { ITrendStatistics, TimeTabItems } from '../model';

@Component({
    standalone: false,
    selector: 'app-trend-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    private readonly service = inject(TrendService);


    public trendToggle = false;
    public todayData: any = {};
    public readonly options = signal<EChartsCoreOption>(null);
    public wordItems: any[] = [];
    public sourceItems: any[] = [];
    public enterItems: any[] = [];
    public pageItems: any[] = [];
    public tabItems = TimeTabItems;
    public tabIndex = 'today';
    public trendData: {
        items: ITrendStatistics[];
        compare_items: ITrendStatistics[];
    };
    public trendIndex = 0; 
    public trendCompare = 0;

    ngOnInit() {
        this.service.batch({
            today: {}
        }).subscribe(res => {
            this.todayData = res.today;
        });
        this.loadTrend();
    }

    public tapTrendIndex(val: number) {
        if (val === this.trendIndex) {
            return;
        }
        this.trendIndex = val;
        this.refreshTrendChart();
    }

    public tapTrendCompare(val: number) {
        this.trendCompare = val === this.trendCompare ? 0 : val;
        this.loadTrend();
    }

    private refreshTrendChart() {
        if (!this.trendData) {
            this.options.set(null);
            return;
        }
        const data = this.trendData;
        const firstName = this.tabItems.filter(i => i.value == this.tabIndex)[0].name;
        const option = <EChartsCoreOption>{
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: [firstName],
                right: 10,
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: data.items.map(item => item.date),
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    name: firstName,
                    type: 'line',
                    animation: false,
                    data: data.items.map(item => {
                        return this.trendIndex < 1 ? item.pv : item.uv;
                    }),
                },
            ]
        };
        if (this.trendCompare > 0) {
            const nextName = this.trendCompare == 1 ? '前一天' : '上周同期';
            (option.legend as any).data.push(nextName);
            (option.series as any).push({
                name: nextName,
                type: 'line',
                animation: false,
                data: data.compare_items.map(item => {
                    return this.trendIndex < 1 ? item.pv : item.uv;
                }),
            });
        }
        this.options.set(option);
    }


    public tapTab(val: string) {
        if (val === this.tabIndex) {
            return;
        }
        if (val !== 'today' && val !== 'yesterday') {
            this.trendCompare = 0;
        }
        this.tabIndex = val;
        this.loadTrend();
    }

    private loadTrend() {
        this.service.trendStatistics(this.tabIndex, this.trendCompare).subscribe(res => {
            this.trendData = res;
            this.refreshTrendChart();
        });
    }

    public loadWord() {
        this.service.sourceList({
            type: 'keywords',
            start_at: this.tabIndex,
            per_page: 10
        }).subscribe(res => {
            this.wordItems = res.data;
        });
    }

    public loadSource() {
        this.service.sourceList({
            type: 'link',
            start_at: this.tabIndex,
            per_page: 10
        }).subscribe(res => {
            this.sourceItems = res.data;
        });
    }

    public loadEnter() {
        this.service.visitEnterList({
            start_at: this.tabIndex,
            per_page: 10
        }).subscribe(res => {
            this.enterItems = res.data;
        });
    }

    public loadPage() {
        this.service.visitList({
            start_at: this.tabIndex,
            per_page: 10
        }).subscribe(res => {
            this.pageItems = res.data;
        });
    }
}
