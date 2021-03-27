import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ICourse, IExamPage } from '../../../model';
import { ExamService } from '../../exam.service';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        rule_type: [0],
        limit_time: [120],
        start_at: [''],
        end_at: [''],
        option: this.fb.array([]),
    });

    public data: IExamPage;
    public courseItems: ICourse[] = [];
    public typeItems = ['单选题', '多选题', '判断题', '简答题', '填空题'];

    constructor(
        private fb: FormBuilder,
        private service: ExamService,
        private route: ActivatedRoute,
        private toastrService: ToastrService,
    ) {}

    ngOnInit() {
        this.service.courseAll().subscribe(res => {
            this.courseItems = res.data;
        });
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.page(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
                    name: res.name
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
        const data: IExamPage = Object.assign({}, this.form.value);
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        this.service.questionSave(data).subscribe(_ => {
            this.toastrService.success('保存成功');
            this.tapBack();
        });
    }

}
