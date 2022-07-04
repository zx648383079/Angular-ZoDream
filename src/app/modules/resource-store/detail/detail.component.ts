import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IResource } from '../model';
import { ResourceService } from '../resource.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

    public data: IResource;
    public content: SafeHtml;
    public isLoading = false;
    public tabIndex = 0;

    constructor(
        private sanitizer: DomSanitizer,
        private service: ResourceService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(param => {
            if (!param.id) {
                history.back();
                return;
            }
            this.load(param.id);
        });
    }

    private load(id: any) {
        this.isLoading = true;
        this.service.resource(id).subscribe({
            next: res => {
                this.isLoading = false;
                this.data = res;
                this.content = this.sanitizer.bypassSecurityTrustHtml(this.data.content);
            },
            error: err => {
                this.isLoading = false;
                this.data = undefined;
                history.back();
            }
        });
    }

}
