import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { ButtonEvent } from '../../../../../components/form';
import { IItem } from '../../../../../theme/models/seo';
import { ICourse, IExamPage } from '../../../model';
import { ExamService } from '../../exam.service';
import { form, required } from '@angular/forms/signals';
import { parseNumber } from '../../../../../theme/utils';

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


    public readonly dataModel = signal({
        id: 0,
        name: '',
        course_id: '',
        course_grade: '1',
        rule_type: '',
        limit_time: 120,
        start_at: '',
        end_at: '',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });

    public readonly ruleType = computed(() => parseNumber(this.dataForm.rule_type().value()));

    public courseItems: ICourse[] = [];
    public typeItems = ['单选题', '多选题', '判断题', '简答题', '填空题'];
    public optionItems: any[] = [];
    public gradeItems: IItem[] = [];

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
            this.courseItems = res.data;
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
                });
                this.optionItems = res.rule_value;
            });
        });
    }

    public onCourseChange() {
        this.service.gradeAll({
            course: this.dataForm.course_id().value()
        }).subscribe(res => {
            this.gradeItems = res.data;
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: IExamPage = this.dataForm().value() as any;
        data.rule_value = this.optionItems;
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

    public onRuleChange() {
        this.optionItems = [];
    }

    public tapRemoveItem(i: number) {
        this.optionItems.splice(i, 1);
    }

    public tapAddItem() {
        this.optionItems.push({
            course: this.courseItems[0].id,
            type: 0,
            amount: 1,
            score: 1,
        });
    }


    public tapDialogPage() {
        this.service.questionList({
            ...this.dialogQueries().value(),
            filter: true,
        }).subscribe(res => {
            this.dialogData.items = res.data;
            this.dialogData.total = res.paging.total;
        });
    }

    public tapDialogSearch() {
        this.dialogQueries.page().value.set(1);
        this.tapDialogPage();
    }

    public tapOpen(modal: DialogEvent) {
        modal.open(() => {
            for (const item of this.dialogData.items) {
                if (item.selected && this.indexOf(item.id) < 0) {
                    this.optionItems.push({
                        id: item.id,
                        type: item.type,
                        title: item.title,
                        score: 1
                    });
                }
            }
        });
    }

    private indexOf(id: number): number {
        for (let i = 0; i < this.optionItems.length; i++) {
            const item = this.optionItems[i];
            if (item.id === id) {
                return i;
            }
        }
        return -1;
    }

}
