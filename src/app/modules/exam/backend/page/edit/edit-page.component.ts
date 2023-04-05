import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { ButtonEvent } from '../../../../../components/form';
import { IItem } from '../../../../../theme/models/seo';
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
        course_id: [0],
        course_grade: [1],
        rule_type: [0],
        limit_time: [120],
        start_at: [''],
        end_at: [''],
    });

    public data: IExamPage;
    public courseItems: ICourse[] = [];
    public typeItems = ['单选题', '多选题', '判断题', '简答题', '填空题'];
    public optionItems: any[] = [];
    public gradeItems: IItem[] = [];

    public dialogData = {
        items: [],
        page: 1,
        perPage: 20,
        total: 0,
        keywords: '',
        course: 0,
    };

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
            this.service.page(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
                    name: res.name,
                    course_id: res.course_id,
                    course_grade: res.course_grade,
                    rule_type: res.rule_type,
                    limit_time: res.limit_time,
                    start_at: res.start_at,
                    end_at: res.end_at,
                });
                this.optionItems = res.rule_value;
            });
        });
    }

    get ruleType() {
        return this.form.get('rule_type').value;
    }

    public onCourseChange() {
        this.service.gradeAll({
            course: this.form.get('course_id').value
        }).subscribe(res => {
            this.gradeItems = res.data;
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.form.invalid) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: IExamPage = Object.assign({}, this.form.value) as any;
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
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
            keywords: this.dialogData.keywords,
            course: this.dialogData.course,
            page: this.dialogData.page,
            per_page: this.dialogData.perPage,
            filter: true,
        }).subscribe(res => {
            this.dialogData.items = res.data;
            this.dialogData.total = res.paging.total;
        });
    }

    public tapDialogSearch(form: any) {
        this.dialogData.keywords = form.keywords;
        this.dialogData.course = form.course;
        this.dialogData.page = 1;
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
