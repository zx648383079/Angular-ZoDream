import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { UploadButtonEvent } from '../../../../components/form';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { DownloadService } from '../../../../theme/services';
import { emptyValidate } from '../../../../theme/validators';
import { ILive } from '../../model';
import { TVService } from '../tv.service';

@Component({
    standalone: false,
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss']
})
export class LiveComponent implements OnInit {
    private service = inject(TVService);
    private toastrService = inject(DialogService);
    private route = inject(ActivatedRoute);
    private downloadService = inject(DownloadService);
    private searchService = inject(SearchService);


    public items: ILive[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20
    };
    public editData: ILive = {} as any;

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public onStatusChange(item: ILive) {
        this.service.liveSave(item).subscribe(_ => {});
    }

    public tapExport() {
        this.downloadService.export('tv/admin/live/export', {}, 'live.dpl');
    }

    public tapImport(event: UploadButtonEvent) {
        const form = new FormData();
        form.append('file', event.files[0]);
        event.enter();
        this.service.liveImport(form).subscribe({
            next: _ => {
                event.reset();
                this.tapRefresh();
                this.toastrService.success('导入成功');
            },
            error: err => {
                event.reset();
                this.toastrService.error(err);
            }
        });
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

    /**
    * goPage
    */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.liveList(queries).subscribe({
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

    public open(modal: DialogEvent, item?: ILive) {
        this.editData = item ? Object.assign({}, item) : {
            id: 0,
            title: '',
            thumb: '',
            source: '',
            status: 1,
        };
        modal.open(() => {
            this.service.liveSave(this.editData).subscribe({
                next: () => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.tapPage();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => {
            return !emptyValidate(this.editData.title);
        });
    }

    public tapRemove(item: ILive) {
        this.toastrService.confirm('确定删除“' + item.title + '”直播源？', () => {
            this.service.liveRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        })
    }

}
