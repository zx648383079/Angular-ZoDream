import { Component, inject, signal } from '@angular/core';
import { EChartsCoreOption } from 'echarts/core';
import { formatDate, mapFormat } from '../../../theme/utils';
import { FinanceService } from '../finance.service';
import { form } from '@angular/forms/signals';
import { DateSource } from '../../../components/form';


@Component({
    standalone: false,
    selector: 'app-finance-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    private readonly service = inject(FinanceService);


    public readonly isLoading = signal(true);
    public readonly data = signal<any>({});
    public readonly queries = form(signal({
        start_at: formatDate(new Date(), 'yyyy-mm-01'),
        end_at: '',
        type: 1,
        log_type: 0
    }));
    public readonly typeItems = ['天', '月', '季度', '年'];
    public readonly logTypeItems = ['收入', '支出', '其他'];
    public readonly rangeVisible = signal(false);
    public readonly options = signal<EChartsCoreOption>(null);
    public readonly source = new DateSource();

    constructor() {
        this.onQueriesChange();
    }

    public onDateChange(val: Date|string) {
        this.queries.start_at().value.set(typeof val === 'string' ? val : formatDate(val, 'yyyy-mm-01'));
    }

    public onQueriesChange() {
        this.isLoading.set(true);
        this.service.statistics({...this.queries().value()}).subscribe(res => {
            this.isLoading.set(false);
            this.data.set(res);
            const items: any[] = res.stage_items;
            this.options.set({
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
                        type: 'bar',
                        data: items.map(item => item.income),
                    },
                    {
                        name: '支出',
                        type: 'bar',
                        data: items.map(item => item.expenditure),
                    }
                ]
            });
        });
    }

    public tapType(i: number) {
        this.queries.type().value.set(i);
        this.onQueriesChange();
    }

    public tapLogType(i: number) {
        this.queries.log_type().value.set(i);
    }

    public formatType(v: number) {
        return mapFormat(v, this.typeItems);
    }

}
