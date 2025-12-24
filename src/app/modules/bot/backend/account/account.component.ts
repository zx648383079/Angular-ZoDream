import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../../../backend/menu.service';
import { DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { IItem } from '../../../../theme/models/seo';
import { SearchService } from '../../../../theme/services';
import { mapFormat } from '../../../../theme/utils';
import { BotInstanceKey, IBotAccount } from '../../model';
import { BotService } from '../bot.service';

@Component({
    standalone: false,
    selector: 'app-bot-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
    private readonly service = inject(BotService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly menuService = inject(MenuService);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IBotAccount[]>([]);

    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public selected = 0;
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20
    }));
    public redirectUri = '';

    ngOnInit() {
        this.selected = this.menuService.get(BotInstanceKey, 0);
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
            if (params.redirect_uri) {
                this.redirectUri = params.redirect_uri;
            }
        });
    }

    public formatStatus(val: number) {
        return mapFormat(val, <IItem[]>[
            {name: '未接入', value: 4},
            {name: '已接入', value: 5},
            {name: '已禁止', value: 0},
        ]);
    }

    public formatType(val: number) {
        return mapFormat(val, ['订阅号', '认证订阅号', '企业号', '认证服务号']);
    }

    public tapChange(item: IBotAccount) {
        this.selected = item.id;
        this.menuService.put(BotInstanceKey, item.id);
        this.service.baseId = item.id;
        if (this.redirectUri) {
            this.router.navigateByUrl(this.redirectUri);
        }
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
        this.service.accountList(queries).subscribe({
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

    public tapRemove(item: IBotAccount) {
        this.toastrService.confirm('确定删除“' + item.name + '”公众号？', () => {
            this.service.accountRemove(item.id).subscribe(res => {
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
