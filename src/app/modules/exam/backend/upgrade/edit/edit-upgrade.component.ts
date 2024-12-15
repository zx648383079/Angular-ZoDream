import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { ButtonEvent } from '../../../../../components/form';
import { IItem } from '../../../../../theme/models/seo';
import { ICourse } from '../../../model';
import { ExamService } from '../../exam.service';

@Component({
    standalone: false,
  selector: 'app-edit-upgrade',
  templateUrl: './edit-upgrade.component.html',
  styleUrls: ['./edit-upgrade.component.scss']
})
export class EditUpgradeComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        course_id: [0],
        course_grade: [1],
        icon: [''],
        description: ['']
    });

    public data: any;
    public courseItems: ICourse[] = [];
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
            this.service.upgrade(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
                    name: res.name,
                    course_id: res.course_id,
                    course_grade: res.course_grade,
                    icon: res.icon,
                    description: res.description,
                });
                // this.optionItems = res.rule_value;
            });
        });
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
        const data: any = Object.assign({}, this.form.value);
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        e?.enter();
        this.service.upgradeSave(data).subscribe({
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

}
