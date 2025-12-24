import { Component, NgZone, OnInit, inject, signal } from '@angular/core';
import {
    BlogService
} from '../blog.service';
import {
    ActivatedRoute,
    Router
} from '@angular/router';
import {
    BLOG_OPEN_KEY,
    IBlog,
} from '../../model';
import { DialogService } from '../../../../components/dialog';
import { SearchService, ThemeService } from '../../../../theme/services';
import { DEEPLINK_SCHEMA, openLink } from '../../../../theme/utils/deeplink';
import { emptyValidate } from '../../../../theme/validators';
import { IErrorResult } from '../../../../theme/models/page';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
    private readonly service = inject(BlogService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly toastrService = inject(DialogService);
    private readonly themeService = inject(ThemeService);
    private readonly searchService = inject(SearchService);
    private readonly ngZoon = inject(NgZone);


    public readonly content = signal('');
    public readonly data = signal<IBlog>(null);
    public readonly isLoading = signal(false);
    public readonly relationItems = signal<IBlog[]>([]);
    public readonly dataForm = form(signal({
        open_key: ''
    }));

    constructor() {
        (window as any).deeplinkOpen = path => {
            this.ngZoon.run(() => {
                openLink(this.router, path);
            });
        };
    }

    ngOnInit() {
        this.route.params.subscribe(param => {
            if (!param.id) {
                this.router.navigate(['../']);
                return;
            }
            this.loadBlog(param.id);
        });
    }

    loadBlog(id: number) {
        if (this.data()?.id === id) {
            return;
        }
        this.isLoading.set(true);
        const openKey = localStorage.getItem(BLOG_OPEN_KEY);
        this.service.batch({
            detail: {id, open_key: openKey},
            relation: {blog: id}
        }).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.data.set(res.detail);
                this.themeService.titleChanged.next(res.detail.seo_title || res.detail.title);
                this.relationItems.set(res.relation);
                this.renderContent(res.detail.content);
                this.searchService.pushHistoryState(res.detail.title,
                    window.location.href.replace(/blog.*$/, 'blog/' + res.detail.id.toString()));
                document.documentElement.scrollTop = 0;
            },
            error: err => {
                this.isLoading.set(false);
                this.toastrService.error(err);
            },
        });
    }

    public tapOpen() {
        if (this.data().can_read) {
            return;
        }
        if (this.data().open_type === 1) {
            this.themeService.emitLogin(true);
            return;
        }
        const openKey = this.dataForm.open_key().value();
        if (this.data().open_type === 5) {
            if (emptyValidate(openKey)) {
                this.toastrService.warning($localize `Please input password`);
                return;
            }
        }
        this.service.openBody({
            id: this.data().id,
            open_key: openKey
        }).subscribe({
            next: res => {
                this.data.update(v => {
                    return {...v, can_read: res.can_read};
                });
                this.renderContent(res.content);
                if (this.data().open_type === 5) {
                    localStorage.setItem(BLOG_OPEN_KEY, openKey);
                }
            },
            error: (err: IErrorResult) => {
                this.toastrService.error(err.error);
                if (err.error.code === 401) {
                    this.themeService.emitLogin(true);
                }
            }
        })
    }

    public tapRecommend() {
        this.service.blogRecommend(this.data().id).subscribe({
            next: res => {
                this.data.update(v => {
                    return {...v, recommend_count: res.recommend_count, is_recommended: res.is_recommended}
                });
            }, 
            error: err => {
                this.toastrService.warning(err);
            }
        });
    }

    public renderContent(html: string) {
        const reg = new RegExp(`href="(${DEEPLINK_SCHEMA}://.+?)"`, 'g');
        this.content.set(html.replace(reg, 'href="javascript:deeplinkOpen(\'$1\');"'));
    }
}
