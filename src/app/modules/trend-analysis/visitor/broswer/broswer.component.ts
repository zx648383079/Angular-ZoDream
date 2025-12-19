import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { IPageQueries } from '../../../../theme/models/page';
import { ITrendAnalysis, TimeTabItems } from '../../model';
import { TrendService } from '../../trend.service';
import { DialogService } from '../../../../components/dialog';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../../theme/services';
import { IItem } from '../../../../theme/models/seo';
import { EChartsCoreOption } from 'echarts/core';

@Component({
    standalone: false,
    selector: 'app-trend-broswer',
    templateUrl: './broswer.component.html',
    styleUrls: ['./broswer.component.scss']
})
export class BroswerComponent implements OnInit {
    private readonly service = inject(TrendService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public items: any[] = [];
    public readonly queries = form(signal({
        start_at: '',
        end_at: '',
        type: 0,
        page: 1,
        per_page: 20
    }));
    public isLoading = false;
    public tabItems = TimeTabItems;
    public tabIndex = '';
    public typeItems: IItem[] = [
        {name: '浏览器', value: 0},
        {name: '网络设备类型', value: 1},
        {name: '屏幕分辨率', value: 2},
        {name: '屏幕颜色', value: 3},
        {name: '是否支持Java', value: 4},
        {name: '语言环境', value: 5},
        {name: '是否支持Cookie', value: 6},
        {name: '网络提供商', value: 7},
    ];
    public options?: EChartsCoreOption;
    public data?: ITrendAnalysis;

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public tapType(val: number) {

    }

    public tapTab(val: string) {
        this.tabIndex = val;
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries: any = {...this.queries().value(), page};
        if (this.tabIndex != '') {
            queries.start_at = this.tabIndex;
            queries.end_at = '';
        }
        this.service.visitClientList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading = false;
                this.formatChart();
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    private formatChart() {
        const items = this.items;
        this.options = <EChartsCoreOption>{
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
                data: items.map(item => item.time),
            },
            yAxis: {
                    type: 'value',
            },
            series: [
                {
                    name: '今日',
                    type: 'line',
                    animation: false,
                    data: items.map(item => item.count),
                },
                {
                    name: '昨日',
                    type: 'line',
                    animation: false,
                    data: items.map(item => item.last),
                }
            ]
        };
    }

    public tapSearch() {

        this.tabIndex = '';
        this.tapRefresh();
    }

}
