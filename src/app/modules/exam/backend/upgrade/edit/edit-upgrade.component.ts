import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { ButtonEvent } from '../../../../../components/form';
import { IItem } from '../../../../../theme/models/seo';
import { ICourse } from '../../../model';
import { ExamService } from '../../exam.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-edit-upgrade',
    templateUrl: './edit-upgrade.component.html',
    styleUrls: ['./edit-upgrade.component.scss']
})
export class EditUpgradeComponent implements OnInit {
    private readonly service = inject(ExamService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly dataModel = signal({
        id: 0,
        name: '',
        course_id: '',
        course_grade: '1',
        icon: '',
        description: '',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
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
                this.dataModel.set({
                    id: res.id,
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
            course: this.dataForm.course_id().value()
        }).subscribe(res => {
            this.gradeItems = res.data;
        });
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
        const data: any = this.dataForm().value();
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
