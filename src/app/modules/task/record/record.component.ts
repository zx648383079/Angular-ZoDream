import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { parseNumber, twoPad } from '../../../theme/utils';
import { TaskService } from '../task.service';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-record',
    templateUrl: './record.component.html',
    styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit {
    private readonly service = inject(TaskService);
    private readonly route = inject(ActivatedRoute);


    public readonly queries = form(signal({
        date: '',
        type: '0',
    }));

    public readonly items = signal<any[]>([]);
    public typeItems = ['按天', '按周', '按月'];

    public readonly typeValue = computed(() => parseNumber(this.queries.type().value()));

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const type = parseInt(params.type, 10) || 0;
            if (type) {
                this.queries.type().value.set(type as any);
            }
            this.tapRefresh();
        });
    }

    public readonly dayItems = computed(() => {
        const items = [];
        for (let index = 0; index < 24; index++) {
            items.push({
                label: twoPad(index) + ':00',
                items: []
            });
        }
        let i = 0;
        for (const item of this.items()) {
            const date = new Date(item.created_at);
            items[0].items.push(Object.assign({
                style: {
                    left: (date.getHours() * 50 + date.getMinutes() * 5 / 6) + 'px',
                    top: i * 40 + 'px',
                    width: item.time / 60 * 5 / 6 + 'px',
                }
            }, item));
            i ++;
        }
        return items;
    });

    public readonly weekItems = computed(() => {
        const items = [];
        ['一', '二', '三', '四', '五', '六', '日'].forEach(i => {
            items.push({
                label: '周' + i,
                items: []
            });
        });
        for (const item of this.items()) {
            const date = new Date(item.created_at);
            const w = date.getDay() - 1;
            items[w].items.push(Object.assign({
                style: {
                    left: w * 200 + 'px',
                    top: items[w].items.length * 40 + 'px',
                }
            }, item));
        }
        return items;
    });

    public readonly monthItems = computed(() => {
        const now = new Date();
        const date = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const count = date.getDate();
        date.setDate(1);
        const start = date.getDay() - 1;
        const items = [];
        for (let i = 0; i < start; i++) {
            items.push({
                label: '',
                items: []
            });
        }
        for (let index = 1; index < count; index++) {
            items.push({
                label: twoPad(index),
                items: []
            });
        }
        for (const item of this.items()) {
            const d = new Date(item.created_at);
            const i = d.getDate() + start - 1;
            items[i].items.push(Object.assign({}, item));
        }
        return items;
    })

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapRefresh() {
        this.service.record(this.queries().value()).subscribe(res => {
            this.items.set(res.data);
        });
    }
}
