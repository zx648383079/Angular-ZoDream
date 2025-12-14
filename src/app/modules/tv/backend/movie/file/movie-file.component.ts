import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { UploadCustomEvent } from '../../../../../components/form';
import { IPageQueries } from '../../../../../theme/models/page';
import { SearchService } from '../../../../../theme/services';
import { parseNumber } from '../../../../../theme/utils';
import { emptyValidate } from '../../../../../theme/validators';
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


    public items: IMovieFile[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20
    }));
    public editData: IMovieFile = {} as any;
    public series: IMovieSeries = {} as any;
    public urlTypeItems = ['文件', '网址', '网盘', '种子', '字幕文件'];
    public definitionItems = ['标清', '高清', '蓝光'];

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.series.movie_id = parseNumber(params.movie);
            this.series.id = parseNumber(params.series);
        });
        this.route.queryParams.subscribe(params => {
            this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public onFileUpload(e: UploadCustomEvent, isFile = false) {
        this.service.movieUpload(e.file).subscribe({
            next: res => {
                if (isFile) {
                    this.editData.size = res.size;
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
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.movieFileList({...queries, movie: this.series.movie_id, series: this.series.id}).subscribe({
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

    public open(modal: DialogEvent, item?: IMovieFile) {
        this.editData = item ? Object.assign({}, item) : {
            id: 0,
            movie_id: this.series.movie_id,
            series_id: this.series.id,
            name: '',
            file_type: 0,
            definition: 0,
            file: '',
            size: 0,
        };
        modal.open(() => {
            this.service.movieFileSave(this.editData).subscribe({
                next: () => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.tapPage();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => {
            return !emptyValidate(this.editData.file);
        });
    }

    public tapRemove(item: IMovieFile) {
        this.toastrService.confirm('确定删除“' + item.name + '”文件？', () => {
            this.service.movieFileRemove(item.id).subscribe(res => {
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
