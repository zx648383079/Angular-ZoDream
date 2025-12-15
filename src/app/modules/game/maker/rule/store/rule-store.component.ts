import { form, required } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { IGameItem, IGameStoreItem } from '../../../model';
import { IPageQueries } from '../../../../../theme/models/page';
import { ActivatedRoute } from '@angular/router';
import { DialogService, DialogEvent } from '../../../../../components/dialog';
import { SearchService } from '../../../../../theme/services';
import { parseNumber } from '../../../../../theme/utils';
import { GameMakerService } from '../../game-maker.service';

@Component({
    standalone: false,
  selector: 'app-maker-rule-store',
  templateUrl: './rule-store.component.html',
  styleUrls: ['./rule-store.component.scss']
})
export class RuleStoreComponent implements OnInit {
    private readonly service = inject(GameMakerService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public items: IGameStoreItem[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        keywords: '',
        project: 0
    }));
    public readonly editForm = form(signal<IGameStoreItem>({
        id: 0,
        name: '',
        thumb: '',
        amount: 0,
        price: 0,
        type: 0,
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

    public open(modal: DialogEvent, item?: IGameStoreItem) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.thumb = item?.thumb ?? '';
            v.amount = item?.amount ?? 0;
            v.price = item?.price ?? 0;
            v.type = item?.type ?? 0;
            return v;
        });
        modal.open(() => {
            this.service.storeSave({...this.editForm().value(), project_id: this.queries.project}).subscribe({
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
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.storeList(queries).subscribe({
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

    public tapRemove(item: IGameStoreItem) {
        this.toastrService.confirm('确定删除“' + item.name + '”物品？', () => {
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
