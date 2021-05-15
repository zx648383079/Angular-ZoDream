import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../dialog';
import { rangeStep } from '../../../../theme/utils';
import { ICourse, IQuestion } from '../../../model';
import { ExamService } from '../../exam.service';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss']
})
export class EditQuestionComponent implements OnInit {

    public form = this.fb.group({
        title: ['', Validators.required],
        course_id: [0, Validators.required],
        image: [''],
        parent_id: [0],
        type: [0],
        easiness: [0],
        content: [''],
        dynamic: [''],
        answer: [''],
        analysis: [''],
        option: this.fb.array([]),
    });

    public data: IQuestion;
    public courseItems: ICourse[] = [];
    public easinessItems = rangeStep(1, 10);
    public typeItems = ['单选题', '多选题', '判断题', '简答题', '填空题'];

    constructor(
        private fb: FormBuilder,
        private service: ExamService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) {}

    ngOnInit() {
        this.service.courseAll().subscribe(res => {
            this.courseItems = res.data;
        });
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.question(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
                    title: res.title,
                    course_id: res.course_id,
                    image: res.image,
                    parent_id: res.parent_id,
                    type: res.type,
                    easiness: res.easiness,
                    content: res.content,
                    dynamic: res.dynamic,
                    answer: res.analysis,
                    analysis: res.analysis,
                });
                if (res.option) {
                    res.option.forEach(i => {
                        this.optionItems.push(this.fb.group(i));
                    });
                }
            });
        });
    }

    get typeValue() {
        return this.form.get('type').value;
    }

    get optionItems() {
        return this.form.get('option') as FormArray;
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: IQuestion = Object.assign({}, this.form.value);
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        this.service.questionSave(data).subscribe(_ => {
            this.toastrService.success('保存成功');
            this.tapBack();
        });
    }

    public tapRemoveItem(i: number) {
        this.optionItems.removeAt(i);
    }

    public tapAddItem() {
        this.optionItems.push(this.fb.group({
            content: '',
            type: 0,
            is_right: 0,
        }));
    }
}
