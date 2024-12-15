import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { IForum } from '../../model';
import { ForumService } from '../forum.service';

@Component({
    standalone: false,
  selector: 'app-forum-list',
  templateUrl: './forum-list.component.html',
  styleUrls: ['./forum-list.component.scss']
})
export class ForumListComponent implements OnInit {

    public items: IForum[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
        parent: 0,
    };
    public parent: IForum;

    constructor(
        private service: ForumService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private searchService: SearchService,
    ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            if (this.queries.parent < 1 || this.parent?.id === this.queries.parent) {
                this.tapPage();
                return;
            }
            this.service.forum(this.queries.parent).subscribe(data => {
                this.parent = data;
                this.tapPage();
            });
        });
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
        this.service.forumList(queries).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
            this.searchService.applyHistory(this.queries = queries);
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: IForum) {
        if (!confirm('确定删除“' + item.name + '”板块？')) {
            return;
        }
        this.service.forumRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success($localize `Delete Successfully`);
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }

    public tapViewChild(item?: IForum) {
        this.parent = item;
        this.queries.keywords = '';
        this.queries.parent = item ? item.id : 0;
        this.tapRefresh();
    }

    public tapParent() {
        const parentId = this.parent ? this.parent.parent_id : 0;
        if (parentId < 1) {
            this.tapViewChild();
            return;
        }
        this.service.forum(parentId).subscribe(res => {
            this.tapViewChild(res);
        });
    }

}
