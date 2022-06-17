import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { IPageQueries } from '../../../../../theme/models/page';
import { applyHistory, getQueries } from '../../../../../theme/query';
import { emptyValidate } from '../../../../../theme/validators';
import { IMovieScore } from '../../../model';
import { TVService } from '../../tv.service';

@Component({
  selector: 'app-movie-score',
  templateUrl: './movie-score.component.html',
  styleUrls: ['./movie-score.component.scss']
})
export class MovieScoreComponent implements OnInit {

    public items: IMovieScore[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20
    };
    public editData: IMovieScore = {} as any;

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
        this.service.scoreList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                applyHistory(this.queries = queries);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
    }

    public open(modal: DialogEvent, item?: IMovieScore) {
        this.editData = item ? Object.assign({}, item) : {
            id: 0,
            name: '',
            score: 10,
            url: '',
        };
        modal.open(() => {
            this.service.scoreSave(this.editData).subscribe({
                next: () => {
                    this.toastrService.success('保存成功');
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

    public tapRemove(item: IMovieScore) {
        this.toastrService.confirm('确定删除“' + item.name + '”歌曲？', () => {
            this.service.scoreRemove(item.id).subscribe(res => {
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
