import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { UploadCustomEvent } from '../../../../components/form';
import { IPageQueries } from '../../../../theme/models/page';
import { IItem } from '../../../../theme/models/seo';
import { SearchService } from '../../../../theme/services';
import { emptyValidate } from '../../../../theme/validators';
import { IMusic } from '../../model';
import { TVService } from '../tv.service';

@Component({
    standalone: false,
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss']
})
export class MusicComponent implements OnInit {
    private service = inject(TVService);
    private toastrService = inject(DialogService);
    private route = inject(ActivatedRoute);
    private searchService = inject(SearchService);


    public items: IMusic[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20
    };
    public editData: IMusic = {} as any;
    public fileTypeItems: IItem[] = [
        {name: '标准音质', value: 0},
        {name: '低音质', value: 1},
        {name: '高音质', value: 2},
        {name: '超高音质', value: 3},
        {name: '歌词', value: 11},
    ]

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public onFileUpload(e: UploadCustomEvent) {
        this.service.musicUpload(e.file).subscribe({
            next: res => {
                e.next(res);
            },
            error: err => {
                this.toastrService.error(err);
                e.next();
            }
        });
    }

    public tapRemoveFile(i: number) {
        this.editData.files.splice(i, 1);
    }

    public tapAddFile() {
        this.editData.files.push({
            file_type: 0,
            file: '',
        } as any);
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
        this.service.musicList(queries).subscribe({
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

    public open(modal: DialogEvent, item?: IMusic) {
        if (!item) {
            this.editMusic(modal, {
                id: 0,
                name: '',
                cover: '',
                album: '',
                artist: '',
                duration: 0,
                files: [],
            });
            return;
        }
        this.service.music(item.id).subscribe({
            next: res => {
                this.editMusic(modal, res);
            },
            error: err => {
                this.toastrService.error(err);
                this.tapPage();
            }
        });
    }

    private editMusic(modal: DialogEvent, item: IMusic) {
        this.editData = item;
        modal.open(() => {
            this.service.musicSave(this.editData).subscribe({
                next: () => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.tapPage();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => {
            return !emptyValidate(this.editData.name);
        });
    }

    public tapRemove(item: IMusic) {
        this.toastrService.confirm('确定删除“' + item.name + '”歌曲？', () => {
            this.service.musicRemove(item.id).subscribe(res => {
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
