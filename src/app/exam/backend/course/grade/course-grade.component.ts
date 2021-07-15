import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { applyHistory, getQueries } from '../../../../theme/query';
import { emptyValidate } from '../../../../theme/validators';
import { ICourse } from '../../../model';
import { ExamService } from '../../exam.service';

@Component({
  selector: 'app-course-grade',
  templateUrl: './course-grade.component.html',
  styleUrls: ['./course-grade.component.scss']
})
export class CourseGradeComponent implements OnInit {

    public items: any[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
        course: 0,
    };
    public editData: any = {} as any;
    public courseItems: ICourse[] = [];

    constructor(
        private service: ExamService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.service.courseAll().subscribe(res => {
            this.courseItems = res.data;
        });
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public open(modal: DialogEvent, item?: any) {
        this.editData = item ? {...item} : {
            id: 0,
            name: '',
            grade: 1,
            course_id: 0,
        };
        modal.open(() => {
            this.service.gradeSave(this.editData).subscribe(_ => {
                this.toastrService.success('保存成功');
                this.tapRefresh();
            });
        }, () => !emptyValidate(this.editData.name) && this.editData.grade > 0);
    }

    /**
     * tapRefresh
     */
    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapMore() {
        this.goPage(this.queries.page + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.gradeList(queries).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
            applyHistory(this.queries = queries);
        });
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: any) {
        this.toastrService.confirm('确定删除“' + item.name + '”等级？', () => {
            this.service.gradeRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success('删除成功');
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
    }

}
