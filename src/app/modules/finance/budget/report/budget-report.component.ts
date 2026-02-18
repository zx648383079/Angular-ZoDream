import { Component, DestroyRef, inject, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { Location } from '@angular/common';
import { FinanceService } from '../../finance.service';
import { ThemeService } from '../../../../theme/services';
import { EChartsCoreOption } from 'echarts/core';
import { formatDate } from '../../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-budget-report',
    templateUrl: './budget-report.component.html',
    styleUrls: ['./budget-report.component.scss']
})
export class BudgetReportComponent {

    private readonly service = inject(FinanceService);
    private readonly themeService = inject(ThemeService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly location = inject(Location);

    public readonly isLoading = signal(true);

    public readonly queries = form(signal({
        start_at: formatDate(new Date(), 'yyyy-01-01'),
        end_at: '',
    }));

    public readonly options = signal<EChartsCoreOption>(null);
    public readonly monthOptions = signal<EChartsCoreOption>(null);

    constructor() {
        this.themeService.tabletIf(this.destroyRef);
        this.onQueriesChange();
    }

    public tapBack() {
        this.location.back();
    }

    public onQueriesChange() {
        this.isLoading.set(true);
        this.service.budgetMonthStatistics(this.queries().value()).subscribe(res => {
            this.isLoading.set(false);
            this.options.set({
                title: {
                    text: '预算支出统计',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [
                    {
                        name: '已支出预算',
                        type: 'pie',
                        radius: '50%',
                        data: res.data.map(i => {
                            return {
                                name: i.name,
                                value: i.total
                            }
                        }),
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            });

            

            const dateItems = Array.from(new Set([].concat(...res.data.map(i => i.items.map(i => i.date))))).sort((a, b) => a - b);


            this.monthOptions.set({
                title: {
                    text: '预算支出月统计图',
                    left: 'center',
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: [],
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: dateItems,
                },
                yAxis: {
                    type: 'value'
                },
                series: res.data.map(i => {
                    const maps = {};
                    for (const item of i.items) {
                        maps[item.date] = item.money;
                    }
                    return {
                        name: i.name,
                        type: 'line',
                        stack: 'Total',
                        data: dateItems.map(v => maps[v] || 0),
                    };
                })
            });
        });
    }
}
