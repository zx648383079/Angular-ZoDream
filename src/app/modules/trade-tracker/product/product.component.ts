import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrackerService } from '../tracker.service';
import { IChannel, IProduct } from '../model';
import { EChartsCoreOption } from 'echarts/core';
import { parseNumber } from '../../../theme/utils';
import { DialogService } from '../../../components/dialog';
import { IItem } from '../../../theme/models/seo';



@Component({
    standalone: false,
    selector: 'app-tracker-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
    private readonly service = inject(TrackerService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public data: IProduct;
    public children: IProduct[] = [];
    public channelItems: IChannel[] = [];
    public isLoading = false;
    public options: EChartsCoreOption;
    public channelSelected = 0;
    public productSelected = 0;
    public typeItems: IItem[] = [
        {name: '出售', value: 0},
        {name: '求购', value: 1},
    ];
    public queries = {
        start_at: '',
        end_at: '',
        type: 0
    };

    ngOnInit() {
        this.route.params.subscribe(res => {
            this.load(this.productSelected = parseNumber(res.id));
        });
        this.route.queryParams.subscribe(params => {
            if (params.channel) {
                this.channelSelected = parseNumber(params.channel);
            }
        });
    }

    private load(id: number) {
        this.isLoading = true;
        this.service.product(id).subscribe({
            next: res => {
                this.isLoading = false;
                this.data = res;
                this.children = res.items ?? [];
                this.channelItems = res.channel_items ?? [];
                this.tapChannel(this.isChannelId(this.channelSelected) ? this.channelSelected : this.channelItems[0].id);
            },
            error: err => {
                this.toastrService.error(err);
                this.isLoading = false;
                this.tapBack();
            }
        })
    }

    public tapBack() {
        history.back();
    }

    public onQueriesChange() {
        this.loadChart(this.productSelected, this.channelSelected);
    }

    public tapChannel(id: number) {
        this.channelSelected = id;
        this.loadChart(this.productSelected, id);
    }

    public tapProduct(id: number) {
        this.productSelected = id;
        if (this.isProductId(id)) {
            this.loadChart(id, this.channelSelected);
            return;
        }
        this.load(id);
    }

    private isProductId(id: number): boolean {
        if (id === this.data.id) {
            return true;
        }
        for (const item of this.children) {
            if (id === item.id) {
                return true;
            }
        }
        return false;
    }

    private isChannelId(id: number): boolean {
        if (id < 1) {
            return false;
        }
        for (const item of this.channelItems) {
            if (item.id === id) {
                return true;
            }
        }
        return false;
    }

    private loadChart(id: number, channel: number) {
        this.isLoading = true;
        this.service.productChart({
            ...this.queries().value(),
            id,
            channel,
        }).subscribe(res => {
            this.isLoading = false;
            const items = res.data;
            this.options = {
                title: {
                    text: this.queries.type < 1 ? '出售统计' : '求购统计',
                    left: 'center',
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['价格', '数量'],
                    left: 10,
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: items.map(item => item.date),
                },
                yAxis: [
                    {
                        name: '价格(￥)',
                        type: 'value'
                    },
                    {
                        name: '数量(个)',
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '价格',
                        type: 'line',
                        data: items.map(item => item.price),
                    },
                    {
                        name: '数量',
                        type: 'line',
                        yAxisIndex: 1,
                        data: items.map(item => item.order_count),
                    }
                ]
            };
        });
    }
}
