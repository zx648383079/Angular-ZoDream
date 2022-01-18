import {
    Component,
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
} from '../../../theme/models/blog';
import { DialogService } from '../../../dialog';
import { ThemeService } from '../../../theme/services';

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
    ) {
        
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
                this.data = res.detail;
                this.themeService.setTitle(this.data.seo_title || this.data.title);
                this.relationItems = res.relation;
                this.content = this.sanitizer.bypassSecurityTrustHtml(this.data.content);
                history.pushState(null, this.data.title,
                    window.location.href.replace(/blog.*$/, 'blog/' + this.data.id.toString()));
                document.documentElement.scrollTop = 0;
            },
            error: err => {
                this.toastrService.error(err);
            },
            complete: () => {
                this.isLoading = false;
            }
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
}
