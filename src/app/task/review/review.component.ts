import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITaskReview } from '../model';
import { TaskService } from '../task.service';
import { EChartsOption } from 'echarts';

@Component({
    selector: 'app-review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {

    public date = '';
    public type = 0;
    public chart = 0;
    public ignore = false;

    public items: ITaskReview[] = [];

    public typeItems = ['按周', '按月'];
    public chartItems = ['表格', '图表'];

    public chartOption: EChartsOption = {
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

    constructor(
        private service: TaskService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params.type) {
                this.type = parseInt(params.type, 10) || 0;
            }
            this.tapRefresh();
        });
    }

    public tapSearch(form: any) {
        this.date = form.date || '';
        this.type = parseInt(form.type, 10) || 0;
        this.ignore = !!form.ignore;
        this.tapRefresh();
    }

    public tapRefresh() {
        this.service.review({
            date: this.date,
            type: this.type,
            ignore: this.ignore
        }).subscribe(res => {
            this.items = res.data;
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
