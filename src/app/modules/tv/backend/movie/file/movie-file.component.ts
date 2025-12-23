import { form, required } from '@angular/forms/signals';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { UploadCustomEvent } from '../../../../../components/form';
import { IPageQueries } from '../../../../../theme/models/page';
import { SearchService } from '../../../../../theme/services';
import { parseNumber } from '../../../../../theme/utils';
import { IMovie, IMovieFile, IMovieSeries } from '../../../model';
import { TVService } from '../../tv.service';

@Component({
    standalone: false,
    selector: 'app-movie-file',
    templateUrl: './movie-file.component.html',
    styleUrls: ['./movie-file.component.scss']
})
export class MovieFileComponent implements OnInit {
    private readonly service = inject(TVService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IMovieFile[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20
    }));
    public readonly editForm = form(signal({
        id: 0,
        movie_id: 0,
        series_id: 0,
        name: '',
        file_type: '0',
        definition: '0',
        file: '',
        size: 0,
    }), schemaPath => {
        required(schemaPath.file);
    });
    public readonly fileType = computed(() => parseNumber(this.editForm.file_type().value()));
    public series: IMovieSeries = {} as any;
    public urlTypeItems = ['文件', '网址', '网盘', '种子', '字幕文件'];
    public definitionItems = ['标清', '高清', '蓝光'];

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.series.movie_id = parseNumber(params.movie);
            this.series.id = parseNumber(params.series);
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public onFileUpload(e: UploadCustomEvent, isFile = false) {
        this.service.movieUpload(e.file).subscribe({
            next: res => {
                if (isFile) {
                    this.editForm.size().value.set(res.size);
                }
                e.next(res);
            },
            error: err => {
                this.toastrService.error(err);
                e.next();
            }
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

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.movieFileList({...queries, movie: this.series.movie_id, series: this.series.id}).subscribe({
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

    public open(modal: DialogEvent, item?: IMovieFile) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.movie_id = this.series.movie_id;
            v.series_id = this.series.id;
            v.name = item?.name ?? '';
            v.file_type = item?.file_type as any ?? '';
            v.definition = item?.definition as any ?? '';
            v.file = item?.file ?? '';
            v.size = item?.size ?? 0;
            return v;
        });
        modal.open(() => {
            this.service.movieFileSave(this.editForm().value()).subscribe({
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

    public tapRemove(item: IMovieFile) {
        this.toastrService.confirm('确定删除“' + item.name + '”文件？', () => {
            this.service.movieFileRemove(item.id).subscribe(res => {
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
        })
    }

}
