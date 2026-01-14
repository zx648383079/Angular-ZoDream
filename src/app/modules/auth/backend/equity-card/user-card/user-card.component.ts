import { form, required } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { IEquityCard, IUserCard } from '../../../../../theme/models/auth';
import { IPageQueries } from '../../../../../theme/models/page';
import { IUser } from '../../../../../theme/models/user';
import { AuthService } from '../../auth.service';
import { SearchService } from '../../../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-user-card',
    templateUrl: './user-card.component.html',
    styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
    private readonly service = inject(AuthService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly searchService = inject(SearchService);

    public readonly items = signal<IUserCard[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
    }));
    public readonly user = signal<IUser>(null);
    public readonly editForm = form(signal({
        card_id: 0,
        expired_at: '',
    }), schemaPath => {
        required(schemaPath.card_id);
    });
    public readonly cardItems = signal<IEquityCard[]>([]);

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.user.set({id: params.user} as any);
            this.service.user(params.user).subscribe(user => {
                this.user.set(user);
            });
        });
        this.service.cardSearch({}).subscribe(res => {
            this.cardItems.set(res.data);
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public open(modal: DialogEvent, item?: any) {
        this.editForm().value.update(v => {
            v.card_id = item?.card_id ?? 0;
            v.expired_at = item?.expired_at ?? '';
            return {...v};
        });
        modal.open(() => {
            this.service.userCardUpdate({...this.editForm().value(), user_id: this.user().id}).subscribe(_ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapRefresh();
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
        this.service.userCardList({...queries, user: this.user().id}).subscribe({
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

}
