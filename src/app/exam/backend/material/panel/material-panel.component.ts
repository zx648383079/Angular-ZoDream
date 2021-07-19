import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogService } from '../../../../dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { getQueries } from '../../../../theme/query';
import { ICourse, IQuestionMaterial } from '../../../model';
import { ExamService } from '../../exam.service';

@Component({
  selector: 'app-material-panel',
  templateUrl: './material-panel.component.html',
  styleUrls: ['./material-panel.component.scss']
})
export class MaterialPanelComponent implements OnInit {

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
    @Input() public courseItems: ICourse[] = [];
    public typeItems = ['文本', '音频', '视频'];
    public tabIndex = false;
    @Input() public value: IQuestionMaterial;
    @Output() public valueChange = new EventEmitter<IQuestionMaterial>();
    public editData: IQuestionMaterial = {
        title: '',
        course_id: 0,
        description: '',
        type: 0,
        content: '',
    };

    constructor(
        private service: ExamService,
        private toastrService: DialogService,
    ) {}

    ngOnInit() {
    }

    public tapSelected(item: IQuestionMaterial) {
        this.valueChange.emit(this.value = item);
    }

    public tapAdd() {
        this.tabIndex = !this.tabIndex;
    }

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
        });
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
        this.tabIndex = false;
    }

}
