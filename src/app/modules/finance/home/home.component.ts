import { Component, OnInit } from '@angular/core';
import { EChartsCoreOption } from 'echarts/core';
import { mapFormat } from '../../../theme/utils';
import { FinanceService } from '../finance.service';


@Component({
    standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public isLoading = true;
    public data: any = {};
    public queries = {
        start_at: '',
        end_at: '',
        type: 0
    };
    public typeItems = ['天', '月', '季度', '年'];
    public options: EChartsCoreOption;

    constructor(
        private service: FinanceService,
    ) { }

    ngOnInit() {
        this.onQueriesChange();
    }

    public onQueriesChange() {
        this.isLoading = true;
        this.service.statistics({...this.queries}).subscribe(res => {
            this.isLoading = false;
            this.data = res;
            const items: any[] = res.stage_items;
            this.options = {
                title: {
                    text: '统计表统计',
                    left: 'center',
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['收入', '支出'],
                    left: 10,
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: items.map(item => item.date),
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '收入',
                        type: 'line',
                        data: items.map(item => item.income),
                    },
                    {
                        name: '支出',
                        type: 'line',
                        data: items.map(item => item.expenditure),
                    }
                ]
            };
        });
    }

    public tapType(i: number) {
        this.queries.type = i;
        this.onQueriesChange();
    }

    public formatType(v: number) {
        return mapFormat(v, this.typeItems);
    }

}
