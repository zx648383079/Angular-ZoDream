import { Component, OnInit, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TrackerService } from '../tracker.service';
import { IChannel, IProduct } from '../model';
import { EChartsCoreOption } from 'echarts/core';
import { parseNumber } from '../../../theme/utils';
import { DialogService } from '../../../components/dialog';
import { IItem } from '../../../theme/models/seo';
import { form } from '@angular/forms/signals';



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
    private readonly location = inject(Location);

    public readonly data = signal<IProduct>(null);;
    public readonly children = signal<IProduct[]>([]);;
    public readonly channelItems = signal<IChannel[]>([]);;
    public readonly isLoading = signal(false);
    public readonly options = signal<EChartsCoreOption>(null);
    public readonly channelSelected = signal(0);
    public readonly productSelected = signal(0);
    public typeItems: IItem[] = [
        {name: '出售', value: 0},
        {name: '求购', value: 1},
    ];
    public readonly queries = form(signal({
        start_at: '',
        end_at: '',
        type: 0
    }));

    ngOnInit() {
        this.route.params.subscribe(res => {
            const product = parseNumber(res.id);
            this.productSelected.set(product);
            this.load(product);
        });
        this.route.queryParams.subscribe(params => {
            if (params.channel) {
                this.channelSelected.set(parseNumber(params.channel));
            }
        });
    }

    private load(id: number) {
        this.isLoading.set(true);
        this.service.product(id).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.data.set(res);
                this.children.set(res.items ?? []);
                this.channelItems.set(res.channel_items ?? []);
                this.tapChannel(this.isChannelId(this.channelSelected()) ? this.channelSelected() : this.channelItems()[0].id);
            },
            error: err => {
                this.toastrService.error(err);
                this.isLoading.set(false);
                this.tapBack();
            }
        })
    }

    public tapBack() {
        this.location.back();
    }

    public onQueriesChange() {
        this.loadChart(this.productSelected(), this.channelSelected());
    }

    public tapChannel(id: number) {
        this.channelSelected.set(id);
        this.loadChart(this.productSelected(), id);
    }

    public tapProduct(id: number) {
        this.productSelected.set(id);
        if (this.isProductId(id)) {
            this.loadChart(id, this.channelSelected());
            return;
        }
        this.load(id);
    }

    private isProductId(id: number): boolean {
        if (id === this.data().id) {
            return true;
        }
        for (const item of this.children()) {
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
        for (const item of this.channelItems()) {
            if (item.id === id) {
                return true;
            }
        }
        return false;
    }

    private loadChart(id: number, channel: number) {
        this.isLoading.set(true);
        this.service.productChart({
            ...this.queries().value(),
            id,
            channel,
        }).subscribe(res => {
            this.isLoading.set(false);
            const items = res.data;
            this.options.set({
                title: {
                    text: this.queries.type().value() < 1 ? '出售统计' : '求购统计',
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
            });
        });
    }
}
