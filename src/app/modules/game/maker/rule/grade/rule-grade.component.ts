import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { IPageQueries } from '../../../../../theme/models/page';
import { SearchService } from '../../../../../theme/services';
import { parseNumber } from '../../../../../theme/utils';
import { IGameRuleGrade } from '../../../model';
import { GameMakerService } from '../../game-maker.service';

@Component({
    standalone: false,
  selector: 'app-maker-rule-grade',
  templateUrl: './rule-grade.component.html',
  styleUrls: ['./rule-grade.component.scss']
})
export class RuleGradeComponent implements OnInit {
    private service = inject(GameMakerService);
    private toastrService = inject(DialogService);
    private route = inject(ActivatedRoute);
    private searchService = inject(SearchService);


    public items: IGameRuleGrade[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
        project: 0
    };
    public editData: IGameRuleGrade = {} as any;
    public generateData = {
        begin: 1,
        end: 100,
        begin_exp: 1,
        step_type: 0,
        step_exp: 0,
        preview_grade: 1,
        preview_exp: 1
    };

    ngOnInit() {
        this.route.parent.params.subscribe(params => {
            this.queries.project = parseNumber(params.game);
        });
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public open(modal: DialogEvent, item?: IGameRuleGrade) {
        this.editData = item ? {...item} : {} as any;
        modal.open(() => {
            this.service.ruleGradeSave({...this.editData, project_id: this.queries.project}).subscribe({
                next: _ => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        });
    }

    public openBatch(modal: DialogEvent) {
        modal.open(() => {
            this.service.ruleGradeGenerate({...this.generateData, project: this.queries.project}).subscribe({
                next: _ => {
                    this.toastrService.success($localize `Generate Successfully`);
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        });
    }

    public onPreviewChange() {
        if (this.generateData.preview_grade > this.generateData.begin) {
            this.generateData.preview_grade = this.generateData.begin;
        }
        this.tapPreviewTo(this.generateData.preview_grade);
    }

    public tapPreviewOffset(offset = 1) {
        this.tapPreviewTo(this.generateData.preview_grade + offset);
    }

    public tapPreviewMax(isFirst = true) {
        this.tapPreviewTo(isFirst ? this.generateData.begin : this.generateData.end);
    }

    public tapPreviewTo(grade: number) {
        if (grade < this.generateData.begin) {
            return;
        }
        this.generateData.preview_grade = grade;
        const diff = this.generateData.preview_grade - this.generateData.begin;
        if (diff < 0) {
            return;
        }
        this.generateData.preview_exp = this.generateData.step_type > 0 ? (this.generateData.begin * Math.pow(1 + this.generateData.step_exp / 100, diff)) : (this.generateData.begin + this.generateData.step_exp * diff);
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
        this.service.ruleGradeList(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries, ['project']);
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: IGameRuleGrade) {
        this.toastrService.confirm('确定删除“' + item.name + '”土著？', () => {
            // this.service.forumRemove(item.id).subscribe(res => {
            //     if (!res.data) {
            //         return;
            //     }
            //     this.toastrService.success($localize `Delete Successfully`);
            //     this.items = this.items.filter(it => {
            //         return it.id !== item.id;
            //     });
            // });
        });
    }

}
