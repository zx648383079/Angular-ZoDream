import { form, required } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
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
    private readonly service = inject(TVService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public items: IMusic[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20
    }));
    public readonly editForm = form(signal<IMusic>({
        id: 0,
        name: '',
        cover: '',
        album: '',
        artist: '',
        duration: 0,
        files: [],
    }), schemaPath => {
        required(schemaPath.name);
    });
    public fileTypeItems: IItem[] = [
        {name: '标准音质', value: 0},
        {name: '低音质', value: 1},
        {name: '高音质', value: 2},
        {name: '超高音质', value: 3},
        {name: '歌词', value: 11},
    ]

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
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
        this.editForm.files().value.update(v => {
            v.splice(i, 1);
            return v;
        });
    }

    public tapAddFile() {
        this.editForm.files().value.update(v => {
            v.push({
                file_type: '0',
                file: '',
            } as any);
            return v;
        });
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
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.musicList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch() {

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
        this.editForm().value.set(item);
        modal.open(() => {
            this.service.musicSave(this.editForm().value()).subscribe({
                next: () => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.tapPage();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => this.editForm().valid());
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
