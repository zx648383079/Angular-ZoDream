import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EChartsCoreOption } from 'echarts/core';
import { mapFormat } from '../../../../theme/utils';
import { FinanceService } from '../../finance.service';
import { IBudget } from '../../model';

@Component({
    standalone: false,
    selector: 'app-finance-budget-container',
    templateUrl: './budget-container.component.html',
    styleUrls: ['./budget-container.component.scss']
})
export class BudgetContainerComponent implements OnInit {
    private service = inject(FinanceService);
    private route = inject(ActivatedRoute);


    public isLoading = true;
    public data: IBudget;
    public options: EChartsCoreOption;
    public cycleFormat = '';
    public total = 0;
    public budgetTotal = 0;
    public overTotal = 0;

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.onQueriesChange(parseInt(params.id, 10));
        });
    }

    public tapBack() {
        history.back();
    }

    public onQueriesChange(id: number) {
        this.isLoading = true;
        this.service.budgetStatistics(id).subscribe(res => {
            this.isLoading = false;
            this.data = res.data;
            this.total = res.sum;
            this.budgetTotal = res.budget_sum;
            this.overTotal = Math.max(this.total - this.budgetTotal, 0);
            this.cycleFormat = mapFormat(this.data.cycle, ['次', '天', '周', '月', '年']);
            const items: any[] = res.log_list;
            this.options = {
                title: {
                    text: '预算支出环比图',
                    left: 'center',
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: [],
                    left: 'right',
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
                        name: '支出',
                        type: 'bar',
                        barMaxWidth: 50,
                        data: items.map(item => item.count),
                    },
                    {
                        name: '预算',
                        type: 'line',
                        data: items.map(item => item.budget),
                    }
                ]
            };
        });
    }

}
