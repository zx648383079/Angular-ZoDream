import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { IDiskServerFile, ILinkServerData } from '../../model';
import { DiskService } from '../disk.service';
import { DialogService } from '../../../../components/dialog';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

    public items: IDiskServerFile[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20,
    };
    public linkToggle = false;
    public data: ILinkServerData = {
        linked: false,
        server_url: '',
        upload_url: '',
        download_url: '',
        ping_url: '',
    };

    constructor(
        private service: DiskService,
        private route: ActivatedRoute,
        private searchService: SearchService,
        private toastrService: DialogService,
    ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public tapLink() {
        if (!this.data.server_url) {
            this.toastrService.warning('请填写服务器地址');
            return;
        }
        this.data.linked = !this.data.linked;
        this.service.linkServer(this.data).subscribe({
            next: res => {
                this.data = res;
            },
            error: err => {
                this.toastrService.error(err);
                this.data.linked = false;
            }
        })
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    /**
    * tapRefresh
    */
    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapMore() {
        this.goPage(this.queries.page + 1);
    }

    /**
    * goPage
    */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.fileList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
