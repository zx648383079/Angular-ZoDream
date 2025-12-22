import { form, required } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { IGameAchieve } from '../../../model';
import { IPageQueries } from '../../../../../theme/models/page';
import { GameMakerService } from '../../game-maker.service';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../../../theme/services';
import { parseNumber } from '../../../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-maker-achieve',
    templateUrl: './achieve.component.html',
    styleUrls: ['./achieve.component.scss']
})
export class AchieveComponent implements OnInit {
    private readonly service = inject(GameMakerService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IGameAchieve[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        keywords: '',
        project: 0
    }));
    public readonly editForm = form(signal<IGameAchieve>({
        id: 0,
        name: '',
        icon: '',
        description: '',
        demand: 0,
    }), schemaPath => {
        required(schemaPath.name);
    });

    ngOnInit() {
        this.route.parent.params.subscribe(params => {
            this.queries.project().value.set(parseNumber(params.game));
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public open(modal: DialogEvent, item?: IGameAchieve) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.icon = item?.icon ?? '';
            v.description = item?.description ?? '';
            v.demand = item?.demand ?? 0;
            return v;
        });
        modal.open(() => {
            this.service.achieveSave({...this.editForm().value(), project_id: this.queries.project}).subscribe({
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
        this.service.achieveList(queries).subscribe({
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

    public tapSearch() {

        this.tapRefresh();
    }

    public tapRemove(item: IGameAchieve) {
        this.toastrService.confirm('确定删除“' + item.name + '”成就？', () => {
            // this.service.achieveRemove(item.id).subscribe(res => {
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
