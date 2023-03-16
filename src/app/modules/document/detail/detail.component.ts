import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import * as ClipboardJS from 'clipboard';
import { DialogService } from '../../../components/dialog';
import { DialogBoxComponent } from '../../../components/dialog';
import { IErrorResult } from '../../../theme/models/page';
import { SearchService } from '../../../theme/services';
import { emptyValidate } from '../../../theme/validators';
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
    public previous: IDocApi&IDocPage;
    public next: IDocApi&IDocPage;
    public keywords = '';
    public kindItems = [
        $localize `All`,
        $localize `Request`,
        $localize `Response`,
    ];
    public langItems: string[] = [];
    public codeData = {
        content: '',
    }

    constructor(
        private service: DocumentService,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private toastrService: DialogService,
        private searchService: SearchService,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.project) {
                return;
            }
            this.version = params.version ? parseInt(params.version, 10) : 0;
            this.initData(params.project, this.version, params.id);
        });
    }

    public get formatCatalog() {
        if (emptyValidate(this.keywords)) {
            return this.catalog;
        }
        const items = [];
        this.eachCatalog(this.catalog, item => {
            if (item.type < 1 && item.name.indexOf(this.keywords) >= 0) {
                items.push(item);
            }
        });
        return items;
    }

    public openCode(modal: DialogBoxComponent) {
        this.codeData.content = '';
        modal.open();
    }

    public tapRead(item: IDocApi&IDocPage) {
        if (item.type > 0) {
            item.expanded = !item.expanded;
            return;
        }
        item.expanded = true;
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

    private initData(project: number, version: number, id: any) {
        const data: any = {
            project: {
                id: project
            },
            version: {
                id: project
            },
            catalog: {
                id: project,
                version: version,
            },
            language: {},
        };
        if (id && id > 0) {
            data.page = {
                project,
                id
            };
        }
        this.service.batch(data).subscribe(res => {
            this.project = res.project;
            this.versionItems = res.version;
            this.catalog = res.catalog.data;
            this.langItems = res.language.data;
            if (res.page) {
                this.setPageData(res.page);
                return;
            }
            if (!this.catalog[0].children) {
                this.loadData(this.catalog[0].id);
                return;
            }
            this.catalog[0].expanded = true;
            this.loadData(this.catalog[0].children[0].id);
        }, (err: IErrorResult) => {
            this.toastrService.warning(err.error.message);
        });
    }

    private loadData(id: any) {
        if (this.catalog.length < 1) {
            return;
        }
        this.service.projectPage(this.project.id, id).subscribe(res => {
            this.setPageData(res);
        });
    }

    private setPageData(res: IDocApi&IDocPage) {
        this.data = res;
        if (this.project.type < 1) {
            this.data.content = this.sanitizer.bypassSecurityTrustHtml(res.content)
        } else {
            this.data.example = JSON.stringify(this.data.example, null, 4);
        }
        this.findNavigation(res.id);
        this.searchService.pushHistoryState(res.name,
            window.location.href.replace(/\/\d+.*/, ['', this.project.id, this.version, res.id].join('/')));
        document.documentElement.scrollTop = 0;
    }

    private findNavigation(id: number) {
        let previous: IDocApi&IDocPage;
        let next: IDocApi&IDocPage;
        let found = false;
        this.eachCatalog(this.catalog, item => {
            if (found && item.type < 1) {
                next = item;
                return false;
            }
            if (!found && id == item.id) {
                found = true;
                return;
            }
            if (!found && item.type < 1) {
                previous = item;
            }
        });
        this.previous = previous;
        this.next = next;
    }

    private eachCatalog(items: IDocApi[]&IDocPage[], cb: (item: IDocApi&IDocPage) => any) {
        for (const item of items) {
            if (cb(item) === false) {
                return false;
            }
            if (item.children && this.eachCatalog(item.children, cb) === false) {
                return false;
            }
        }
    }

    public tapGenerate(form: any) {
        this.service.apiCode({
            id: this.data.id,
            lang: form.lang,
            kind: form.kind,
        }).subscribe({
            next: res => {
                this.codeData.content = res.data;
            }, 
            error: (err: IErrorResult) => {
                this.toastrService.warning(err.error.message);
            }
        });
    }

    public tapCopy(e: MouseEvent) {
        const clipboard: any = new ClipboardJS(e.currentTarget as HTMLDivElement, {
            text: () => {
              return this.codeData.content;
            },
        });
        clipboard.on('success', (e) => {
            this.toastrService.success($localize `Copy successfully`);
            e.clearSelection();
        });
        clipboard.on('error', (e) => {
            this.toastrService.warning($localize `Copy failed`);
        });
        clipboard.onClick(e);
    }

}
