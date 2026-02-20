import { form, required } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { IGameMapArea } from '../../../model';
import { IPageQueries } from '../../../../../theme/models/page';
import { GameMakerService } from '../../game-maker.service';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../../../theme/services';
import { parseNumber } from '../../../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-maker-map-area',
    templateUrl: './map-area.component.html',
    styleUrls: ['./map-area.component.scss']
})
export class MapAreaComponent {
    private readonly service = inject(GameMakerService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IGameMapArea[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public parent: IGameMapArea;
    public readonly editForm = form(signal({
        id: 0,
        name: '',
    }), schemaPath => {
        required(schemaPath.name);
    });
    public readonly queries = form(signal({
        page: 1,
        per_page: 20,
        keywords: '',
        parent: 0,
        project: 0,
    }));

    constructor() {
        this.route.parent.params.subscribe(params => {
            this.queries.project().value.set(parseNumber(params.game));
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
            const parent = this.queries.parent().value();
            if (parent < 1) {
                return;
            }
            this.service.mapArea(parent, this.queries.project().value()).subscribe(data => {
                this.parent = data;
            });
        });
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
        const queries = {...this.queries().value(), page};
        this.service.mapAreaList(queries).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
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

    public tapRemove(item: IGameMapArea) {
        this.toastrService.confirm('确定删除“' + item.name + '”地区？', () => {
            this.service.mapAreaRemove(item.id, this.queries.project).subscribe(res => {
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
        });
    }

    public tapViewRegion(item?: IGameMapArea) {
        this.parent = item;
        this.queries().value.update(v => {
            v.parent = item?.id || 0;
            v.keywords = '';
            return v;
        });
        this.tapRefresh();
    }

    public tapParentRegion() {
        const parentId = this.parent ? this.parent.parent_id : 0;
        if (parentId < 1) {
            this.tapViewRegion();
            return;
        }
        this.service.mapArea(parentId, this.queries.project).subscribe(res => {
            this.tapViewRegion(res);
        });
    }

    public open(modal: DialogEvent, item?: IGameMapArea) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            return {...v};
        });
        modal.open(() => {
            this.service.mapAreaSave({
                name: this.editForm.name,
                parent_id: this.parent?.id,
                id: this.editForm?.id,
                project_id: this.queries.project
            }).subscribe({
                next: _ => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.tapPage();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => this.editForm().valid());
    }

}
