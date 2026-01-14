import { Component, OnInit, computed, inject, signal } from '@angular/core';
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
    private readonly service = inject(FinanceService);
    private readonly route = inject(ActivatedRoute);


    public readonly isLoading = signal(true);
    public readonly data = signal<IBudget>(null);
    public readonly options = signal<EChartsCoreOption>(null);
    
    public readonly total = signal(0);
    public readonly budgetTotal = signal(0);
    public readonly overTotal = computed(() => {
        return Math.max(this.total() - this.budgetTotal(), 0);
    });
    public readonly cycleFormat = computed(() => {
        return mapFormat(this.data().cycle, ['次', '天', '周', '月', '年']);
    });

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.onQueriesChange(parseInt(params.id, 10));
        });
    }

    public tapBack() {
        history.back();
    }

    public onQueriesChange(id: number) {
        this.isLoading.set(true);
        this.service.budgetStatistics(id).subscribe(res => {
            this.isLoading.set(false);
            this.data.set(res.data);
            this.total.set(res.sum);
            this.budgetTotal.set(res.budget_sum);
            const items: any[] = res.log_list;
            this.options.set({
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
            });
        });
    }

}
