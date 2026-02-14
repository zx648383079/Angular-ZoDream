import { form, required } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { SearchService } from '../../../../theme/services';
import { ICourse, IQuestionMaterial } from '../../model';
import { ExamService } from '../exam.service';

@Component({
    standalone: false,
    selector: 'app-material',
    templateUrl: './material.component.html',
    styleUrls: ['./material.component.scss']
})
export class MaterialComponent {
    private readonly service = inject(ExamService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IQuestionMaterial[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        page: 1,
        per_page: 20,
        keywords: '',
        course: '0',
    }));
    public readonly editForm = form(signal({
        id: 0,
        title: '',
        course_id: 0,
        description: '',
        type: 0,
        content: '',
    }), schemaPath => {
        required(schemaPath.title);
        required(schemaPath.content);
    });
    public readonly courseItems = signal<ICourse[]>([]);
    public typeItems = ['文本', '音频', '视频'];

    constructor() {
        this.service.courseAll().subscribe(res => {
            this.courseItems.set(res.data);
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public open(modal: DialogEvent, item?: IQuestionMaterial) {
        this.editForm().value.update(v => {
            v.title = item?.title ?? '';
            v.course_id = item?.course_id ?? 0;
            v.description = item?.description ?? '';
            v.type = item?.type ?? 0;
            v.content = item?.content ?? '';
            return {...v};
        });
        modal.open(() => {
            this.service.materialSave({...this.editForm().value()}).subscribe(res => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapPage();
            });
        }, () => this.editForm().valid());
    }


    /**
     * tapRefresh
     */
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
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page, full: true};
        this.service.materialList(queries).subscribe(res => {
            this.isLoading.set(false);
            this.items.set(res.data);
            this.hasMore = res.paging.more;
            this.total.set(res.paging.total);
            this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapRemove(item: IQuestionMaterial) {
        this.toastrService.confirm('确定删除“' + item.title + '”素材？', () => {
            this.service.materialRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items.update(v => {
                    return v.filter(it => {
                        return it.id !== item.id;
                    });
                });
            });
        })

    }

}
