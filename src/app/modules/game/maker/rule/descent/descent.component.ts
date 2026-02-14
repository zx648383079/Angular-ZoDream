import { form, required } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { IPageQueries } from '../../../../../theme/models/page';
import { IGameDescent } from '../../../model';
import { ActivatedRoute } from '@angular/router';
import { DialogService, DialogEvent } from '../../../../../components/dialog';
import { SearchService } from '../../../../../theme/services';
import { parseNumber } from '../../../../../theme/utils';
import { GameMakerService } from '../../game-maker.service';

@Component({
    standalone: false,
    selector: 'app-maker-descent',
    templateUrl: './descent.component.html',
    styleUrls: ['./descent.component.scss']
})
export class DescentComponent {
    private readonly service = inject(GameMakerService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IGameDescent[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        keywords: '',
        project: 0
    }));
    public readonly editForm = form(signal<IGameDescent>({
        id: 0,
        name: '',
        lifespan: 0,
        description: ''
    }), schemaPath => {
        required(schemaPath.name);
    });

    constructor() {
        this.route.parent.params.subscribe(params => {
            this.queries.project().value.set(parseNumber(params.game));
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public open(modal: DialogEvent, item?: IGameDescent) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.lifespan = item?.lifespan ?? 0;
            v.description = item?.description ?? '';
            return {...v};
        });
        modal.open(() => {
            this.service.descentSave({...this.editForm().value(), project_id: this.queries.project}).subscribe({
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
        const queries = {...this.queries().value(), page};
        this.service.descentList(queries).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.queries().value.set(queries);
            this.searchService.applyHistory(queries, ['project']);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapRemove(item: IGameDescent) {
        this.toastrService.confirm('确定删除“' + item.name + '”血统？', () => {
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
