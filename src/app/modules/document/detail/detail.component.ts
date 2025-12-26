import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { DialogBoxComponent } from '../../../components/dialog';
import { IErrorResult } from '../../../theme/models/page';
import { SearchService } from '../../../theme/services';
import { emptyValidate } from '../../../theme/validators';
import { DocumentService } from '../document.service';
import { IDocApi, IDocPage, IProject, IProjectVersion } from '../model';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
    private readonly service = inject(DocumentService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly searchService = inject(SearchService);


    public readonly navToggle = signal(false);
    public readonly project = signal<IProject>(null);
    public readonly data = signal<IDocApi&IDocPage>(null);
    public readonly catalog = signal<IDocPage[]&IDocApi[]>([]);
    public readonly versionItems = signal<IProjectVersion[]>([]);
    public readonly previous = signal<IDocApi&IDocPage>(null);
    public readonly next = signal<IDocApi&IDocPage>(null);
    public readonly queries = form(signal({
        version: '0',
        keywords: ''
    }));
    public kindItems = [
        $localize `All`,
        $localize `Request`,
        $localize `Response`,
    ];
    public readonly langItems = signal<string[]>([]);
    public readonly codeForm = form(signal({
        kind: '',
        lang: '',
        content: '',
    }));

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.project) {
                return;
            }
            const version = params.version ? parseInt(params.version, 10) : 0;
            this.queries.version().value.set(version as any);
            this.initData(params.project, version, params.id);
        });
    }

    public readonly formatCatalog = computed(() => {
        const keywords = this.queries.keywords().value();
        if (emptyValidate(keywords)) {
            return this.catalog();
        }
        const items = [];
        this.eachCatalog(this.catalog(), item => {
            if (item.type < 1 && item.name.indexOf(keywords) >= 0) {
                items.push(item);
            }
        });
        return items;
    });

    public toggle() {
        this.navToggle.update(v => !v);
    }

    public openCode(modal: DialogBoxComponent) {
        this.codeForm.content().value.set('');
        modal.open();
    }

    public tapRead(item: IDocApi&IDocPage) {
        if (item.type > 0) {
            item.expanded = !item.expanded;
            return;
        }
        item.expanded = true;
        if (window.innerWidth < 770) {
            this.navToggle.set(false);
        }
        this.loadData(item.id);
    }

    public onVersionChange() {
        this.service.catalogAll(this.project().id, this.queries.version().value()).subscribe(res => {
            this.catalog.set(res.data);
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
        this.service.batch(data).subscribe({
            next: res => {
                this.project.set(res.project);
                this.versionItems.set(res.version);
                this.catalog.set(res.catalog.data);
                this.langItems.set(res.language.data);
                if (res.page) {
                    this.setPageData(res.page);
                    return;
                }
                if (!this.catalog()[0].children) {
                    this.loadData(this.catalog()[0].id);
                    return;
                }
                this.catalog()[0].expanded = true;
                this.loadData(this.catalog()[0].children[0].id);
            }, 
            error: err => {
                this.toastrService.warning(err);
            }
        });
    }

    private loadData(id: any) {
        if (this.catalog().length < 1) {
            return;
        }
        this.service.projectPage(this.project().id, id).subscribe(res => {
            this.setPageData(res);
        });
    }

    private setPageData(res: IDocApi&IDocPage) {
        this.data.set(res);
        if (this.project().type < 1) {
        } else {
            this.data.update(v => {
                v.example = JSON.stringify(v.example, null, 4);
                return v;
            });
        }
        this.findNavigation(res.id);
        this.searchService.pushHistoryState(res.name,
            window.location.href.replace(/\/\d+.*/, ['', this.project().id, this.queries.version().value(), res.id].join('/')));
        document.documentElement.scrollTop = 0;
    }

    private findNavigation(id: number) {
        let previous: IDocApi&IDocPage;
        let next: IDocApi&IDocPage;
        let found = false;
        this.eachCatalog(this.catalog(), item => {
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
        this.previous.set(previous);
        this.next.set(next);
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

    public tapGenerate(e: SubmitEvent) {
        e.preventDefault();
        const data = this.codeForm().value();
        this.service.apiCode({
            id: this.data().id,
            lang: data.lang,
            kind: data.kind,
        }).subscribe({
            next: res => {
                this.codeForm.content().value.set(res.data);
            }, 
            error: err => {
                this.toastrService.warning(err);
            }
        });
    }

    public tapCopy(e: MouseEvent) {
        navigator.clipboard.writeText(this.codeForm.content().value()).then(
            () => {
                this.toastrService.success($localize `Copy successfully`);
            },
            () => {
                this.toastrService.warning($localize `Copy failed`);
            }
        );
    }

}
