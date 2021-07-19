import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogBoxComponent, DialogEvent, DialogService } from '../../../../dialog';
import { ButtonEvent } from '../../../../form';
import { IItem } from '../../../../theme/models/seo';
import { emptyValidate } from '../../../../theme/validators';
import { ICourse, IQuestion, IQuestionAnalysis, IQuestionMaterial, IQuestionOption } from '../../../model';
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
        course_grade: [1],
        image: [''],
        parent_id: [0],
        type: [0],
        easiness: [0],
        content: [''],
        dynamic: [''],
        answer: [''],
        analysis: [''],
        option_items: this.fb.array([]),
    });

    public data: IQuestion;
    public courseItems: ICourse[] = [];
    public gradeItems: IItem[] = [];
    public typeItems = ['单选题', '多选题', '判断题', '简答题', '填空题', '大题目'];
    public material: IQuestionMaterial;
    public materialSelected: IQuestionMaterial;
    public analysisItems: IQuestionAnalysis[] = [];
    public optionTypeItems = ['文字', '图片'];
    public childrenItems: IQuestion[] = [];

    public sameItems: IQuestion[] = [];
    public previewData = '';

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
                this.onCourseChange();
                return;
            }
            this.service.question(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
                    title: res.title,
                    course_id: res.course_id,
                    course_grade: res.course_grade,
                    image: res.image,
                    parent_id: res.parent_id,
                    type: res.type,
                    easiness: res.easiness,
                    content: res.content,
                    dynamic: res.dynamic,
                    answer: res.analysis,
                });
                if (res.material) {
                    this.material = res.material;
                }
                if (res.option_items) {
                    res.option_items.forEach(i => {
                        this.optionItems.push(this.fb.group(i));
                    });
                }
                if (res.analysis_items) {
                    this.analysisItems = res.analysis_items;
                }
            });
        });
    }

    get easiness() {
        return this.form.get('easiness').value;
    }

    get easinessLabel() {
        const val = this.easiness;
        if (val < 4) {
            return '简单';
        }
        if (val < 7) {
            return '一般';
        }
        return '困难';
    }

    get typeValue() {
        return this.form.get('type').value;
    }

    get optionItems() {
        return this.form.get('option_items') as FormArray;
    }

    public onCourseChange() {
        this.service.gradeAll({
            course: this.form.get('course_id').value
        }).subscribe(res => {
            this.gradeItems = res.data;
        });
    }

    public onTitleChange() {
        this.sameItems = [];
        const title = this.form.get('title').value;
        if (emptyValidate(title)) {
            return;
        }
        this.service.questionCheck({
            title,
            id: this.data?.id
        }).subscribe(res => {
            this.sameItems = res.data;
        });
    }

    public openPreview(modal: DialogEvent, name: string) {
        this.previewData = this.form.get(name).value;
        modal.open();
    }

    public onTypeChange() {
        if (this.typeValue != 4) {
            return;
        }
        const content = this.form.get('content').value as string;
        if (!content) {
            return;
        }
        const matches = content.match(/_{3,}/g);
        if (!matches || matches.length < 1) {
            return;
        }
        let diff = matches.length - this.optionItems.length;
        if (diff < 1) {
            return;
        }
        for (; diff > 0; diff--) {
            this.tapAddItem();
        }
    }

    public tapMaterial(modal: DialogBoxComponent) {
        modal.open(() => {
            this.material = this.materialSelected;
        }, () => !!this.materialSelected);
    }

    public tapRemoveMaterial(event: MouseEvent) {
        event.stopPropagation();
        this.material = undefined;
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: IQuestion = Object.assign({}, this.form.value);
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        data.analysis_items = this.analysisItems;
        data.material_id = this.material ? this.material.id : 0;
        data.material = data.material_id > 0 ? undefined : this.material;
        if (data.type == 5) {
            data.children = this.childrenItems;
        }
        e?.enter();
        this.service.questionSave(data).subscribe({
            next: _ => {
                this.toastrService.success('保存成功');
                this.tapBack();
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
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
