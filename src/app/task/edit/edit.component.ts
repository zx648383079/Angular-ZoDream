import {
    Component,
    OnInit
} from '@angular/core';
import {
    FormBuilder,
    Validators
} from '@angular/forms';
import {
    ActivatedRoute
} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
    ToastrService
} from 'ngx-toastr';
import {
    ITask
} from '../../theme/models/task';
import {
    TaskService
} from '../task.service';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        description: [''],
        every_time: [0],
    });

    public data: ITask;

    public items: ITask[] = [];

    public editData: ITask;

    constructor(
        private fb: FormBuilder,
        private service: TaskService,
        private route: ActivatedRoute,
        private toastrService: ToastrService,
        private modalService: NgbModal,
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.task(params.id).subscribe(res => {
                this.data = res;
                this.form.setValue({
                    name: res.name,
                    description: res.description,
                    every_time: res.every_time
                });
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: ITask = this.form.value;
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        this.service.taskSave(data).subscribe(_ => {
            this.toastrService.success('保存成功');
            this.tapBack();
        });
    }

    openDialog(content: any, item ?: ITask) {
        this.editData = item || {
            id: undefined,
            name: '',
            description: '',
            every_time: 0,
        };
        this.modalService.open(content, {
            ariaLabelledBy: 'modal-basic-title'
        }).result.then(_ => {
            this.service.taskSave({
                name: this.editData.name,
                parent_id: this.data?.id,
                id: this.editData?.id,
                description: this.editData.description,
                every_time: this.data?.every_time,
            }).subscribe(res => {
                this.toastrService.success('保存成功');
            });
        });
    }
}
