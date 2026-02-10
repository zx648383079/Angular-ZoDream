import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { ButtonEvent } from '../../../../../components/form';
import { IItem } from '../../../../../theme/models/seo';
import { ICourse, IQuestion } from '../../../model';
import { ExamService } from '../../exam.service';
import { form, required } from '@angular/forms/signals';
import { findIndex, parseNumber } from '../../../../../theme/utils';
import { QuestionFinderComponent } from '../../../components';

@Component({
    standalone: false,
    selector: 'app-edit-page',
    templateUrl: './edit-page.component.html',
    styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit {
    private readonly service = inject(ExamService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly location = inject(Location);

    public readonly dataModel = signal({
        id: 0,
        name: '',
        course_id: '',
        course_grade: '1',
        rule_type: '',
        limit_time: 120,
        start_at: '',
        end_at: '',
        course_items: [
            {
                course: '0',
                type: '0',
                score: 10,
                amount: 1,
            }
        ],
        question_items: <{
            id: number;
            type: number;
            title: string;
            score: number;
        }[]>[],
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });

    public readonly ruleType = computed(() => parseNumber(this.dataForm.rule_type().value()));

    public readonly courseItems = signal<ICourse[]>([]);
    public typeItems = ['单选题', '多选题', '判断题', '简答题', '填空题'];
    public readonly optionItems = signal<any[]>([]);
    public readonly gradeItems = signal<IItem[]>([]);

    public readonly dialogQueries = form(signal({
        keywords: '',
        course: '',
        page: 1,
        per_page: 20,
    }));

    public dialogData = {
        items: [],
        total: 0,
    };

    ngOnInit() {
        this.service.courseAll().subscribe(res => {
            this.courseItems.set(res.data);
        });
        this.route.params.subscribe(params => {
            if (!params.id) {
                this.onCourseChange();
                return;
            }
            this.service.page(params.id).subscribe(res => {
                this.dataModel.set({
                    id: res.id,
                    name: res.name,
                    course_id: res.course_id as any,
                    course_grade: res.course_grade as any,
                    rule_type: res.rule_type as any,
                    limit_time: res.limit_time,
                    start_at: res.start_at,
                    end_at: res.end_at,
                    question_items: res.rule_type > 0 ? res.rule_value as any[] : [],
                    course_items: res.rule_type < 1 ? res.rule_value as any[] : []
                });
            });
        });
    }

    public onCourseChange() {
        this.service.gradeAll({
            course: this.dataForm.course_id().value()
        }).subscribe(res => {
            this.gradeItems.set(res.data);
        });
    }

    public tapBack() {
        this.location.back();
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
        const data = this.dataForm().value() as any;
        data.rule_value = data.rule_type > 0 ? data.question_items : data.course_items;
        data.question_items = undefined;
        data.data.course_item = undefined;
        e?.enter();
        this.service.pageSave(data).subscribe({
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

    public tapRemoveItem(i: number, g: number) {
        if (g > 0) {
            this.dataForm.question_items().value.update(v => {
                v.splice(i, 1);
                return [...v];
            });
        } else {
            this.dataForm.course_items().value.update(v => {
                v.splice(i, 1);
                return [...v];
            });
        }
    }

    public tapAddItem() {
        this.dataForm.course_items().value.update(v => {
            return [...v, {
                course: this.courseItems()[0].id as any,
                type: '0',
                amount: 1,
                score: 1,
            }];
        });
    }

    public tapOpen(modal: QuestionFinderComponent) {
        modal.open([], (items: IQuestion[]) => {
            this.dataForm.question_items().value.update(v => {
                return [...v, ...items.filter(i => findIndex(v, j => j.id === i.id) < 0).map(item => {
                    return {
                        id: item.id,
                        type: item.type,
                        title: item.title,
                        score: 1
                    }
                })]
            });
        }, items => items.length > 0, params => {
            return this.service.questionList({
                ...params,
                filter: true,
            })
        });
    }

}
