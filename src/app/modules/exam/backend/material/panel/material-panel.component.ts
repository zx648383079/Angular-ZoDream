import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, input, model, output, signal } from '@angular/core';
import { DialogService } from '../../../../../components/dialog';
import { IPageQueries } from '../../../../../theme/models/page';
import { SearchService } from '../../../../../theme/services';
import { ICourse, IQuestionMaterial } from '../../../model';
import { ExamService } from '../../exam.service';

@Component({
    standalone: false,
    selector: 'app-material-panel',
    templateUrl: './material-panel.component.html',
    styleUrls: ['./material-panel.component.scss']
})
export class MaterialPanelComponent {
    private readonly service = inject(ExamService);
    private readonly toastrService = inject(DialogService);
    private readonly searchService = inject(SearchService);


    public items: IQuestionMaterial[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        keywords: '',
        course: 0,
    }));
    public readonly courseItems = input<ICourse[]>([]);
    public typeItems = ['文本', '音频', '视频'];
    public tabIndex = false;
    public readonly value = model<IQuestionMaterial>();
    public editData: IQuestionMaterial = {
        title: '',
        course_id: 0,
        description: '',
        type: 0,
        content: '',
    };


    public tapSelected(item: IQuestionMaterial) {
        this.value.set(item);
    }

    public tapAdd() {
        this.tabIndex = !this.tabIndex;
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.materialList(queries).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
        });
    }

    public tapSearch() {

        this.tapRefresh();
        this.tabIndex = false;
    }

}
