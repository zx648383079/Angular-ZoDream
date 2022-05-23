import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { IBlockItem } from '../../../components/link-rule';
import { openLink } from '../../../theme/deeplink';
import { IBulletinUser } from '../../../theme/models/auth';
import { UserService } from '../user.service';

@Component({
  selector: 'app-bulletin',
  templateUrl: './bulletin.component.html',
  styleUrls: ['./bulletin.component.scss']
})
export class BulletinComponent implements OnInit {

    public items: IBulletinUser[] = [];

    public hasMore = true;

    public page = 1;

    public perPage = 20;

    public isLoading = false;

    public total = 0;

    constructor(
        private service: UserService,
        private toastrService: DialogService,
        private router: Router,
    ) {
        this.tapRefresh();
    }

    ngOnInit() {}

    public tapToggle(item: IBulletinUser) {
        item.open = !item.open;
        if (item.status > 0) {
            return;
        }
        this.service.bulletinRead(item.bulletin_id).subscribe(_ => {
            item.status = 1;
        });
    }

    public tapReadAll() {
        if (confirm('确定把所有的消息标为已读？已读后仍可查看消息')) {
            return;
        }
        this.service.bulletinReadAll().subscribe(_ => {
            this.items = this.items.map(i => {
                if (i.status < 1) {
                    i.status = 1;
                    i.open = false;
                }
                return i;
            });
        });
    }

    public tapBlock(item: IBlockItem) {
        if (item.link) {
            openLink(this.router, item.link);
            return;
        }
    }

    /**
    * tapRefresh
    */
    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.page);
    }

    public tapMore() {
        this.goPage(this.page + 1);
    }

    /**
    * goPage
    */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.bulletinList({
            page,
            per_page: this.perPage
        }).subscribe(res => {
            this.isLoading = false;
            this.items = res.data.map(i => {
                i.open = i.status < 1;
                return i;
            });
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
        });
    }

    public tapRemove(item: IBulletinUser) {
        if (!confirm('确定删除“' + item.bulletin.title + '”消息？')) {
            return;
        }
        this.service.bulletinRemove(item.bulletin_id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }

}
