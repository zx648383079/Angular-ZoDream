import { Component, OnInit } from '@angular/core';
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

    public items: any[] = [];
    public queries: IPageQueries = {
        start_at: '',        
        end_at: '',
        type: 0,
        page: 1,
        per_page: 20
    };
    public isLoading = false;
    public tabItems = TimeTabItems;
    public tabIndex = '';
    public typeItems: IItem[] = [
        {name: '按省', value: 0},
        {name: '按国家', value: 1},
    ];
    public options?: EChartsCoreOption;
    public data?: ITrendAnalysis;

    constructor(
        private service: TrendService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private searchService: SearchService,
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
        });
        this.tapType(0);
    }

    public tapType(val: number) {
        this.queries.type = val;
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
        this.goPage(this.queries.page);
    }

    public tapMore() {
        this.goPage(this.queries.page + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries: any = {...this.queries, page};
        if (this.tabIndex != '') {
            queries.start_at = this.tabIndex;
            queries.end_at = '';
        }
        this.service.visitClientList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.searchService.applyHistory(this.queries = queries);
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

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tabIndex = '';
        this.tapRefresh();
    }

}
