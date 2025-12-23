import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITaskReview } from '../model';
import { TaskService } from '../task.service';
import { EChartsCoreOption } from 'echarts/core';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
    private readonly service = inject(TaskService);
    private readonly route = inject(ActivatedRoute);


    public readonly queries = form(signal({
        date: '',
        type: '0',
        ignore: false
    }));
    public chart = 0;
    public ignore = false;

    public readonly items = signal<ITaskReview[]>([]);

    public typeItems = ['按周', '按月'];
    public chartItems = ['表格', '图表'];

    public chartOption: EChartsCoreOption = {
        title: {
            text: '工作统计'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: []
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: []
    };

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const type = parseInt(params.type, 10) || 0;
            if (type) {
                this.queries.type().value.set(type as any);
            }
            this.tapRefresh();
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapRefresh() {
        this.service.review(this.queries().value()).subscribe(res => {
            this.items.set(res.data);
            this.refreshChart(res.data);
        });
    }

    private refreshChart(items: ITaskReview[]) {
        const option: any = Object.assign({}, this.chartOption);
        const maps = {
            amount: '估计番茄钟总数',
            success_amount: '实际完成番茄钟总数',
            complete_amount: '任务完成数',
            pause_amount: '中断数',
            failure_amount: '中止数',
        };
        option.legend.data = Object.values(maps);
        const keys = Object.keys(maps);
        for (const item of items) {
            option.xAxis.data.push(item.day);
            let i = 0;
            for (const key of keys) {
                if (option.series.length <= i) {
                    option.series.push({
                        name: maps[key],
                        type: 'line',
                        stack: '总量',
                        data: [],
                    });
                }
                option.series[i].data.push(item[key]);
                i ++;
            }
        }
        this.chartOption = option;
    }

}
