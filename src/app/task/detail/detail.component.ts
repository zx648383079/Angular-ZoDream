import {
    Component,
    OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
    ITask,
    ITaskDay
} from '../../theme/models/task';
import { TaskService } from '../task.service';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

    public time = '';

    public data: ITaskDay;

    public items: ITask[] = [];

    public expanded = false;

    constructor(
        private service: TaskService,
        private toastrService: ToastrService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.day(params.id).subscribe(res => {
                this.data = res;
            });
            this.service.taskList({
            }).subscribe(res => {
                this.items = res.data;
            });
        });
    }


    public tapPlay() {

    }

    public tapPause() {

    }

    public tapStop() {

    }
}