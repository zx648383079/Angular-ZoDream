import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from '../document.service';
import { IDocApi, IDocPage, IProject, IProjectVersion } from '../model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

    public navToggle = false;
    public project: IProject;
    public version = 0;
    public data: IDocApi&IDocPage;
    public catalog: IDocPage[]&IDocApi[] = [];
    public versionItems: IProjectVersion[] = [];

    constructor(
        private service: DocumentService,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.project) {
                return;
            }
            this.version = params.version ? parseInt(params.version, 10) : 0;
            this.service.project(params.project).subscribe(res => {
                this.project = res;
                this.loadCatalog(res.id, params.id)
            });
            
        });
    }

    private loadCatalog(project: any, id: any) {
        this.service.catalogAll(project, this.version).subscribe(res => {
            this.catalog = res.data;
            this.initData(id);
        });
    }

    public tapRead(item: IDocApi&IDocPage) {
        if (item.children) {
            item.expanded = !item.expanded;
            return;
        }
        if (window.innerWidth < 770) {
            this.navToggle = false;
        }
        this.loadData(item.id);
    }

    public onVersionChange() {
        this.service.catalogAll(this.project.id, this.version).subscribe(res => {
            this.catalog = res.data;
            this.loadData(0);
        });
    }

    private initData(id: any) {
        if (this.catalog.length < 1) {
            return;
        }
        this.service.versionAll(this.project.id).subscribe(res => {
            this.versionItems = res.data;
        });
        if (id && id > 0) {
            this.loadData(id);
            return;
        }
        if (!this.catalog[0].children) {
            this.loadData(this.catalog[0].id);
            return;
        }
        this.catalog[0].expanded = true;
        this.loadData(this.catalog[0].children[0].id);
    }

    private loadData(id: any) {
        if (this.catalog.length < 1) {
            return;
        }
        this.service.projectPage(this.project.id, id).subscribe(res => {
            this.data = res;
            if (this.project.type < 1) {
                this.data.content = this.sanitizer.bypassSecurityTrustHtml(res.content)
            } else {
                this.data.example = JSON.stringify(this.data.example, null, 4);
            }
            history.pushState(null, res.name,
                window.location.href.replace(/\/\d+.*/, ['', this.project.id, this.version, res.id].join('/')));
        });
    }

}
