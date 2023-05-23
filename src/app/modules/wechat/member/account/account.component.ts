import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../../../backend/menu.service';
import { DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { IItem } from '../../../../theme/models/seo';
import { SearchService } from '../../../../theme/services';
import { mapFormat } from '../../../../theme/utils';
import { IWeChatAccount } from '../../model';
import { WechatService } from '../wechat.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

    public items: IWeChatAccount[] = [];

    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public selected = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20
    };
    public redirectUri = '';
    public data: any = {};

    constructor(
        private service: WechatService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private router: Router,
        private menuService: MenuService,
        private searchService: SearchService,
    ) {}

    ngOnInit() {
        this.service.statistics().subscribe({
            next: res => {
                this.data = res;
            },
            error: () => {
            }
        });
        this.selected = this.menuService.get('wx', 0);
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
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

    public tapChange(item: IWeChatAccount) {
        this.selected = item.id;
        this.menuService.put('wx', item.id);
        this.service.baseId = item.id;
        if (this.redirectUri) {
            this.router.navigateByUrl(this.redirectUri);
            return;
        }
        console.log(1);
        
        this.router.navigate([item.id, 'reply'], {relativeTo: this.route});
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

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.accountList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries);
                this.isLoading = false;
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

    public tapRemove(item: IWeChatAccount) {
        this.toastrService.confirm('确定删除“' + item.name + '”公众号？', () => {
            this.service.accountRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
        
    }
}
