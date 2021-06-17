import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogBoxComponent, DialogService } from '../../../dialog';
import { IPageQueries } from '../../../theme/models/page';
import { applyHistory, getQueries } from '../../../theme/query';
import { emptyValidate } from '../../../theme/validators';
import { ICourse, IQuestionMaterial } from '../../model';
import { ExamService } from '../exam.service';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss']
})
export class MaterialComponent implements OnInit {

    public items: IQuestionMaterial[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
        course: 0,
    };
    public editData: IQuestionMaterial = {
        title: '',
        course_id: 0,
        description: '',
        type: 0,
        content: '',
    };
    public courseItems: ICourse[] = [];
    public typeItems = ['文本', '音频', '视频'];

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

    public open(modal: DialogBoxComponent, item?: IQuestionMaterial) {
        this.editData = item ? {...item} : {
            title: '',
            course_id: 0,
            description: '',
            type: 0,
            content: '',
        };
        modal.open(() => {
            this.service.materialSave({...this.editData}).subscribe(res => {
                this.toastrService.success('保存成功');
                this.tapPage();
            });
        }, () => {
            return !emptyValidate(this.editData.title) && !emptyValidate(this.editData.content);
        });
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
        this.service.materialList(queries).subscribe(res => {
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

    public tapRemove(item: IQuestionMaterial) {
        if (!confirm('确定删除“' + item.title + '”素材？')) {
            return;
        }
        this.service.materialRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }

}
