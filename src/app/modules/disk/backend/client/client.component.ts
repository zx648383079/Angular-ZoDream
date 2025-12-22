import { form, required } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { IDiskServerFile, ILinkServerData } from '../../model';
import { DiskService } from '../disk.service';
import { DialogService } from '../../../../components/dialog';

@Component({
    standalone: false,
    selector: 'app-client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
    private readonly service = inject(DiskService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);
    private readonly toastrService = inject(DialogService);


    public readonly items = signal<IDiskServerFile[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20,
    }));
    public linkToggle = false;
    public readonly isLinked = signal(false);
    public readonly dataForm = form(signal({
        server_url: '',
        upload_url: '',
        download_url: '',
        ping_url: '',
    }), schemaPath => {
        required(schemaPath.server_url);
    });

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public tapLink() {
        if (this.dataForm().invalid()) {
            this.toastrService.warning('请填写服务器地址');
            return;
        }
        this.isLinked.update(v => !v);
        this.service.linkServer(this.dataForm().value() as any).subscribe({
            next: res => {
                this.isLinked.set(res.linked);
                this.dataForm().value.set(res);
            },
            error: err => {
                this.toastrService.error(err);
                this.isLinked.set(false);
            }
        })
    }

    public tapSearch() {
        this.tapRefresh();
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
        this.service.fileList(queries).subscribe({
            next: res => {
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

}
