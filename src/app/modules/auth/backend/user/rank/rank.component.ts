import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../auth.service';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { SearchService } from '../../../../../theme/services';
import { form, required } from '@angular/forms/signals';
import { IUserRank } from '../../../../../theme/models/user';
import { ButtonEvent } from '../../../../../components/form';

@Component({
    standalone: false,
    selector: 'app-backend-rank',
    templateUrl: './rank.component.html',
    styleUrls: ['./rank.component.scss']
})
export class RankComponent {

    private readonly service = inject(AuthService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly searchService = inject(SearchService);

    public readonly items = signal<IUserRank[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        page: 1,
        keywords: '',
        per_page: 20,
    }));
    public readonly editForm = form(signal<IUserRank>({
        id: 0,
        name: '',
        icon: '',
        level: 0,
        exp: 0
    }), schemaPath => {
        required(schemaPath.name);
        required(schemaPath.level);
        required(schemaPath.exp);
    });

    constructor() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public open(modal: DialogEvent, item?: IUserRank) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.icon = item?.icon ?? '';
            v.level = item?.level ?? 1;
            v.exp = item?.exp ?? 1;
            return {...v};
        });
        modal.open(() => {
            this.service.rankSave(this.editForm().value()).subscribe({
                next: () => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => this.editForm().valid());
    }

    public tapSync(e?: ButtonEvent) {
        e?.enter();
        this.service.rankRefresh().subscribe({
            next: () => {
                e?.reset();
                this.toastrService.success($localize `Update Successfully`);
            },
            error: err => {
                this.toastrService.error(err);
            }
        })
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

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.rankList(queries).subscribe({
            next: res => {
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading.set(false);
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

    public tapRemove(item: IUserRank) {
        this.toastrService.confirm('确定移除“' + item.name + '”？', () => {
            this.service.rankRemove(item.id).subscribe(res => {
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
}
