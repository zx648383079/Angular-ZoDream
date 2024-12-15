import {
    Component,
    NgZone,
    OnInit
} from '@angular/core';
import {
    DomSanitizer,
    SafeHtml
} from '@angular/platform-browser';
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

@Component({
    standalone: false,
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

    public content = '';
    public data: IBlog;
    public isLoading = false;
    public relationItems: IBlog[] = [];
    public commentLoaded = false;
    public openKey = '';

    constructor(
        private service: BlogService,
        private route: ActivatedRoute,
        private router: Router,
        private toastrService: DialogService,
        private themeService: ThemeService,
        private searchService: SearchService,
        private ngZoon: NgZone,
    ) {
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
        if (this.data && this.data.id === id) {
            return;
        }
        this.isLoading = true;
        const openKey = localStorage.getItem(BLOG_OPEN_KEY);
        this.service.batch({
            detail: {id, open_key: openKey},
            relation: {blog: id}
        }).subscribe({
            next: res => {
                this.isLoading = false;
                this.data = res.detail;
                this.themeService.setTitle(this.data.seo_title || this.data.title);
                this.relationItems = res.relation;
                this.renderContent(this.data.content);
                this.searchService.pushHistoryState(this.data.title,
                    window.location.href.replace(/blog.*$/, 'blog/' + this.data.id.toString()));
                document.documentElement.scrollTop = 0;
            },
            error: err => {
                this.isLoading = false;
                this.toastrService.error(err);
            },
        });
    }

    public tapOpen() {
        if (this.data.can_read) {
            return;
        }
        if (this.data.open_type === 1) {
            this.searchService.emitLogin(true);
            return;
        }
        const openKey = this.openKey;
        if (this.data.open_type === 5) {
            if (emptyValidate(openKey)) {
                this.toastrService.warning($localize `Please input password`);
                return;
            }
        }
        this.service.openBody({
            id: this.data.id,
            open_key: openKey
        }).subscribe({
            next: res => {
                this.data.can_read = res.can_read;
                this.renderContent(res.content);
                if (this.data.open_type === 5) {
                    localStorage.setItem(BLOG_OPEN_KEY, openKey);
                }
            },
            error: (err: IErrorResult) => {
                this.toastrService.error(err.error);
                if (err.error.code === 401) {
                    this.searchService.emitLogin(true);
                }
            }
        })
    }

    public tapRecommend() {
        this.service.blogRecommend(this.data.id).subscribe({
            next: res => {
                this.data.recommend_count = res.recommend_count;
                this.data.is_recommended = res.is_recommended;
            }, 
            error: err => {
                this.toastrService.warning(err);
            }
        });
    }

    public renderContent(html: string) {
        const reg = new RegExp(`href="(${DEEPLINK_SCHEMA}://.+?)"`, 'g');
        this.content = html.replace(reg, 'href="javascript:deeplinkOpen(\'$1\');"');
    }
}
