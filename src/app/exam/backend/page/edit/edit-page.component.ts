import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogBoxComponent, DialogService } from '../../../../dialog';
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
    });

    public data: IExamPage;
    public courseItems: ICourse[] = [];
    public typeItems = ['单选题', '多选题', '判断题', '简答题', '填空题'];
    public optionItems: any[] = [];

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
                return;
            }
            this.service.page(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
                    name: res.name,
                    rule_type: res.rule_type,
                    limit_time: res.limit_time,
                    start_at: res.start_at,
                    end_at: res.end_at,
                });
            });
        });
    }

    get ruleType() {
        return this.form.get('rule_type').value;
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
        data.rule_value = this.optionItems;
        this.service.questionSave(data).subscribe(_ => {
            this.toastrService.success('保存成功');
            this.tapBack();
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
        });
    }


    public tapDialogPage() {
        this.service.questionList({
            keywords: this.dialogData.keywords,
            course: this.dialogData.course,
            page: this.dialogData.page,
            per_page: this.dialogData.perPage
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

    public tapOpen(modal: DialogBoxComponent) {
        modal.open(() => {
            for (const item of this.dialogData.items) {
                if (item.selected && this.indexOf(item.id) < 0) {
                    this.optionItems.push({
                        id: item.id,
                        type: item.type,
                        title: item.title,
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
