import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EChartsCoreOption } from 'echarts/core';
import { DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { IItem } from '../../../../theme/models/seo';
import { SearchService } from '../../../../theme/services';
import { ITrendAnalysis, TimeTabItems } from '../../model';
import { TrendService } from '../../trend.service';
import * as echarts from 'echarts/core';

@Component({
    standalone: false,
    selector: 'app-trend-district',
    templateUrl: './district.component.html',
    styleUrls: ['./district.component.scss']
})
export class DistrictComponent implements OnInit {
    private readonly service = inject(TrendService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<any[]>([]);
    public readonly queries = form(signal({
        start_at: '',
        end_at: '',
        type: 0,
        page: 1,
        per_page: 20
    }));
    public readonly isLoading = signal(false);
    public tabItems = TimeTabItems;
    public tabIndex = '';
    public typeItems: IItem[] = [
        {name: '按省', value: 0},
        {name: '按国家', value: 1},
    ];
    public options?: EChartsCoreOption;
    public data?: ITrendAnalysis;

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
        });
        this.tapType(0);
    }

    public tapType(val: number) {
        this.queries.type().value.set(val);
        this.service.map(val < 1).subscribe(res => {
            echarts.registerMap('world', res);
            this.tapRefresh();
        });
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
        this.isLoading.set(true);
        const queries: any = {...this.queries().value(), page};
        if (this.tabIndex != '') {
            queries.start_at = this.tabIndex;
            queries.end_at = '';
        }
        this.service.visitClientList(queries).subscribe({
            next: res => {
                this.items.set(res.data);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading.set(false);
                this.formatChart();
            },
            error: () => {
                this.isLoading.set(false);
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
                trigger: 'item',
                showDelay: 0,
                transitionDuration: 0.2
            },
            series: [
                {
                    name: 'PopEstimates',
                    type: 'map',
                    roam: true,
                    map: 'world',
                    emphasis: {
                        label: {
                            show: true
                        }
                    },
                    data: [
                        {name: '', value: 8},
                    ]
                },
            ]
        };
    }

    public tapSearch() {

        this.tabIndex = '';
        this.tapRefresh();
    }

}
