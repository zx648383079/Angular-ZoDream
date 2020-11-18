import {
    Component,
    OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { twoPad } from '../../theme/utils';
import { TaskService } from '../task.service';

@Component({
    selector: 'app-record',
    templateUrl: './record.component.html',
    styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit {

    public date = '';
    public type = 0;

    public items: any[] = [];

    public typeItems = ['按天', '按周', '按月'];

    constructor(
        private service: TaskService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.tapRefresh();
        });
    }

    get dayItems() {
        const items = [];
        for (let index = 0; index < 24; index++) {
            items.push({
                label: twoPad(index) + ':00',
                items: []
            });
        }
        return items;
    }

    get weekItems() {
        const items = [];
        ['一', '二', '三', '四', '五', '六', '日'].forEach(i => {
            items.push({
                label: '周' + i,
                items: []
            });
        });
        return items;
    }

    get monthItems() {
        const date = new Date();
        const count = date.getDate();
        date.setDate(1);
        const start = date.getDay();
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
        return items;
    }

    public tapSearch(form: any) {
        console.log(form);
    }

    public tapRefresh() {
        this.service.record({
            date: this.date,
            type: this.type,
        }).subscribe(res => {
            this.items = res.data;
        });
    }
}
