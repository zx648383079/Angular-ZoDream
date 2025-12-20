import { form, required } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
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
    private readonly service = inject(GameMakerService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public items: IGameRuleGrade[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        keywords: '',
        project: 0
    }));
    public readonly editForm = form(signal<IGameRuleGrade>({
        id: 0,
        name: '',
        grade: 0,
        exp: 0,
    }), schemaPath => {
        required(schemaPath.name);
    });
    public readonly generateForm = form(signal({
        begin: 1,
        end: 100,
        begin_exp: 1,
        step_type: 0,
        step_exp: 0,
        preview_grade: 1,
        preview_exp: 1
    }));

    ngOnInit() {
        this.route.parent.params.subscribe(params => {
            this.queries.project().value.set(parseNumber(params.game));
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public open(modal: DialogEvent, item?: IGameRuleGrade) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.grade = item?.grade ?? 0;
            v.exp = item?.exp ?? 0;
            return v;
        });
        modal.open(() => {
            this.service.ruleGradeSave({...this.editForm().value(), project_id: this.queries.project}).subscribe({
                next: _ => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => this.editForm().valid());
    }

    public openBatch(modal: DialogEvent) {
        modal.open(() => {
            this.service.ruleGradeGenerate({...this.generateForm().value(), project: this.queries.project}).subscribe({
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
        this.generateForm().value.update(v => {
            if (v.preview_grade > v.begin) {
                v.preview_grade = v.begin;
            }
            return v;
        });
        
        this.tapPreviewTo(this.generateForm.preview_grade().value());
    }

    public tapPreviewOffset(offset = 1) {
        this.tapPreviewTo(this.generateForm.preview_grade().value() + offset);
    }

    public tapPreviewMax(isFirst = true) {
        this.tapPreviewTo(isFirst ? this.generateForm.begin().value() : this.generateForm.end().value());
    }

    public tapPreviewTo(grade: number) {
        this.generateForm().value.update(v => {
            if (grade < v.begin) {
                return v;
            }
            v.preview_grade = grade;
            const diff = v.preview_grade - v.begin;
            if (diff < 0) {
                return v;
            }
            v.preview_exp = v.step_type > 0 ? (v.begin * Math.pow(1 + v.step_exp / 100, diff)) : (v.begin + v.step_exp * diff);
            return v;
        });

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
        this.service.ruleGradeList(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.queries().value.set(queries);
            this.searchService.applyHistory(queries, ['project']);
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch() {

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
