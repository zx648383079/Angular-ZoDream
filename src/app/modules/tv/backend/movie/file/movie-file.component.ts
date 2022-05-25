import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { IPageQueries } from '../../../../../theme/models/page';
import { applyHistory, getQueries } from '../../../../../theme/query';
import { emptyValidate } from '../../../../../theme/validators';
import { IMovieFile } from '../../../model';
import { TVService } from '../../tv.service';

@Component({
  selector: 'app-movie-file',
  templateUrl: './movie-file.component.html',
  styleUrls: ['./movie-file.component.scss']
})
export class MovieFileComponent implements OnInit {

    public items: IMovieFile[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20
    };
    public editData: IMovieFile = {} as any;
    public urlTypeItems = ['文件', '网址', '网盘', '种子'];
    public definitionItems = ['标清', '高清', '蓝光'];

    constructor(
        private service: TVService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
            this.tapPage();
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

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.movieFileList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                applyHistory(this.queries = queries);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
    }

    public open(modal: DialogEvent, item?: IMovieFile) {
        this.editData = item ? Object.assign({}, item) : {
            id: 0,
            movie_id: 0,
            series_id: 0,
            name: '',
            file_type: 0,
            definition: 0,
            file: '',
            size: 0,
            subtitle_file: '',
        };
        modal.open(() => {
            this.service.movieFileSave(this.editData).subscribe({
                next: () => {
                    this.toastrService.success('保存成功');
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
                this.toastrService.success('删除成功');
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        })
    }

}
