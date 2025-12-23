import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogBoxComponent, DialogEvent, DialogService } from '../../../../../components/dialog';
import { ButtonEvent } from '../../../../../components/form';
import { IItem } from '../../../../../theme/models/seo';
import { emptyValidate } from '../../../../../theme/validators';
import { ICourse, IQuestion, IQuestionAnalysis, IQuestionMaterial, QuestionTypeItems } from '../../../model';
import { ExamService } from '../../exam.service';
import { applyEach, form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-edit-question',
    templateUrl: './edit-question.component.html',
    styleUrls: ['./edit-question.component.scss']
})
export class EditQuestionComponent implements OnInit {
    private readonly service = inject(ExamService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly dataModel = signal({
        id: 0,
        title: '',
        course_id: '',
        course_grade: '1',
        image: '',
        parent_id: 0,
        type: '',
        easiness: 0,
        content: '',
        dynamic: '',
        answer: '',
        analysis: '',
        option_items: [
            {
                type: '0',
                content: '',
                is_right: '0'
            }
        ]
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.title);
        required(schemaPath.course_id);
        applyEach(schemaPath.option_items, item => {
            required(item.content);
        });
    });

    public courseItems: ICourse[] = [];
    public gradeItems: IItem[] = [];
    public typeItems = QuestionTypeItems;
    public material: IQuestionMaterial;
    public materialSelected: IQuestionMaterial;
    public analysisItems: IQuestionAnalysis[] = [];
    public optionTypeItems = ['文字', '图片'];
    public childrenItems: IQuestion[] = [];

    public sameItems: IQuestion[] = [];
    public readonly previewForm = form(signal({
        content: ''
    }));

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
                this.dataModel.set({
                    id: res.id,
                    title: res.title,
                    course_id: res.course_id as any,
                    course_grade: res.course_grade as any,
                    image: res.image,
                    parent_id: res.parent_id,
                    type: res.type as any,
                    easiness: res.easiness,
                    content: res.content,
                    dynamic: res.dynamic,
                    answer: res.answer,
                    analysis: res.analysis,
                    option_items: res.option_items?.length > 0 ? res.option_items.map(i => {
                        return {
                            type: i.type,
                            content: i.content,
                            is_right: i.is_right,
                        };
                    }) : [
                        {
                            type: '0',
                            content: '',
                            is_right: '0'
                        }
                    ] as any,
                });
                if (res.material) {
                    this.material = res.material;
                }
                if (res.analysis_items) {
                    this.analysisItems = res.analysis_items;
                }
                if (res.children) {
                    this.childrenItems = res.children;
                }
            });
        });
    }

    public readonly easinessLabel = computed(() => {
        const val = this.dataForm.easiness().value();
        if (val < 4) {
            return '简单';
        }
        if (val < 7) {
            return '一般';
        }
        return '困难';
    });

    public onCourseChange() {
        this.service.gradeAll({
            course: this.dataForm.course_id().value()
        }).subscribe(res => {
            this.gradeItems = res.data;
        });
    }

    public onTitleChange() {
        this.sameItems = [];
        const title = this.dataForm.title().value();
        if (emptyValidate(title)) {
            return;
        }
        this.service.questionCheck({
            title,
            id: this.dataModel().id
        }).subscribe(res => {
            this.sameItems = res.data;
        });
    }

    public openPreview(modal: DialogEvent, name: string) {
        this.previewForm.content().value.set(this.dataModel()[name]);
        modal.open();
    }

    public onTypeChange() {
        if (this.dataForm.type().value() != '4') {
            return;
        }
        const content = this.dataForm.content().value() as string;
        if (!content) {
            return;
        }
        const matches = content.match(/_{3,}/g);
        if (!matches || matches.length < 1) {
            return;
        }
        let diff = matches.length - this.dataForm.option_items().value().length;
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

    public tapSubmit2(e: SubmitEvent) {
        e.preventDefault();
        this.tapSubmit();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: IQuestion = this.dataForm().value() as any;

        data.analysis_items = this.analysisItems;
        data.material_id = this.material ? this.material.id : 0;
        data.material = data.material_id > 0 ? undefined : this.material;
        if (data.type == 5) {
            data.children = this.childrenItems;
        }
        e?.enter();
        this.service.questionSave(data).subscribe({
            next: _ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapBack();
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }

    public tapRemoveItem(i: number) {
        this.dataForm.option_items().value.update(v => {
            v.splice(i, 1);
            return v;
        });
    }

    public tapAddItem() {
        this.dataForm.option_items().value.update(v => {
            v.push({
                content: '',
                type: '0',
                is_right: '0',
            });
            return v;
        });
    }
}
