import { Component, OnInit } from '@angular/core';
import { IForum, IForumClassify, IThread } from '../model';
import { ForumService } from '../forum.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IErrorResult, IPageQueries } from '../../theme/models/page';
import { applyHistory, getQueries } from '../../theme/query';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

    public forum: IForum;
    public items: IThread[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20,
        classify: 0,
    };
    public form = this.fb.group({
        title: ['', Validators.required],
        classify_id: [0],
        content: ['', Validators.required], 
    });

    constructor(
        private fb: FormBuilder,
        private service: ForumService,
        private route: ActivatedRoute,
        private toastrService: ToastrService,
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
        });
        this.route.params.subscribe(params => {
            this.service.getForum(params.id).subscribe(res => {
                this.forum = res;
                this.tapPage();
            });
        });
    }

    public tapClassify(item: IForumClassify) {
        this.queries.classify = item.id;
        this.tapRefresh();
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning('内容没填写完整');
            return;
        }
        const data = {...this.form.value, forum_id: this.forum.id};
        this.service.threadSave(data).subscribe(res => {
            this.toastrService.success('发表成功');
            this.form.patchValue({
                title: '',
                content: '',
            });
            if (this.queries.page < 2) {
                this.tapRefresh();
            }
        }, (err: IErrorResult) => {
            this.toastrService.warning(err.error.message);
        });
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.queries.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.getThreadList({...queries, forum: this.forum.id}).subscribe(res => {
            this.hasMore = res.paging.more;
            this.isLoading = false;
            this.items = res.data.map(i => {
                if (i.classify && i.classify instanceof Array) {
                    i.classify = undefined;
                }
                return i;
            });
            this.total = res.paging.total;
            applyHistory(this.queries = queries);
        }, () => {
            this.isLoading = false;
        });
    }

}
