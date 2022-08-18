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
    IBlog,
} from '../../model';
import { DialogService } from '../../../../components/dialog';
import { ThemeService } from '../../../../theme/services';
import { DEEPLINK_SCHEMA, openLink } from '../../../../theme/deeplink';
import { pushHistoryState } from '../../../../theme/query';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

    public content: SafeHtml;
    public data: IBlog;
    public isLoading = false;
    public relationItems: IBlog[] = [];
    public commentLoaded = false;


    constructor(
        private sanitizer: DomSanitizer,
        private service: BlogService,
        private route: ActivatedRoute,
        private router: Router,
        private toastrService: DialogService,
        private themeService: ThemeService,
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
        this.service.batch({
            detail: {id},
            relation: {blog: id}
        }).subscribe({
            next: res => {
                this.isLoading = false;
                this.data = res.detail;
                this.themeService.setTitle(this.data.seo_title || this.data.title);
                this.relationItems = res.relation;
                this.renderContent(this.data.content);
                pushHistoryState(this.data.title,
                    window.location.href.replace(/blog.*$/, 'blog/' + this.data.id.toString()));
                document.documentElement.scrollTop = 0;
            },
            error: err => {
                this.isLoading = false;
                this.toastrService.error(err);
            },
        });
    }

    public tapRecommend() {
        this.service.blogRecommend(this.data.id).subscribe({
            next: res => {
                this.data.recommend_count = res.recommend_count;
            }, 
            error: err => {
                this.toastrService.warning(err);
            }
        });
    }

    public renderContent(html: string) {
        const reg = new RegExp(`href="(${DEEPLINK_SCHEMA}://.+?)"`, 'g');
        this.content = this.sanitizer.bypassSecurityTrustHtml(html.replace(reg, 'href="javascript:deeplinkOpen(\'$1\');"'));
    }
}
