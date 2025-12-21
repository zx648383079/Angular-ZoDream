import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogBoxComponent } from '../../../../../components/dialog';
import { IApplyLog } from '../../../../../theme/models/auth';
import { IPageQueries } from '../../../../../theme/models/page';
import { AuthService } from '../../auth.service';
import { SearchService } from '../../../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-apply-log',
    templateUrl: './apply-log.component.html',
    styleUrls: ['./apply-log.component.scss']
})
export class ApplyLogComponent implements OnInit {
    private readonly service = inject(AuthService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IApplyLog[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        keywords: '',
        per_page: 20,
    }));
    public readonly dataModel = signal<IApplyLog>({} as any);

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
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
        if (this.isLoading) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.applyLogList(queries).subscribe({
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

    public tapSearch() {

        this.tapRefresh();
    }

    public tapView(modal: DialogBoxComponent, item: IApplyLog) {
        this.dataModel.set(item);
        this.service.user(item.user_id).subscribe(res => {
            this.dataModel.update(v => {
                v.user = res;
                return v;
            });
        });
        modal.openCustom(value => {
            this.service.applySave({
                id: this.dataModel().id,
                status: value
            }).subscribe(res => {
                item.status = res.status;
            });
        });
    }

}
