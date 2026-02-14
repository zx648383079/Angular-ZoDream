import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from '../document.service';
import { IDocApi, IDocPage, IProject } from '../model';

@Component({
    standalone: false,
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss']
})
export class ProjectComponent {
    private readonly service = inject(DocumentService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);


    public readonly data = signal<IProject>(null);
    public readonly catalog = signal<IDocPage[]&IDocApi[]>([]);
    public readonly tabIndex = signal(0);

    constructor() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.project(params.id).subscribe(res => {
                this.data.set(res);
                this.loadCatalog();
            });
        });
    }

    public tapTab(i: number) {
        this.tabIndex.set(i);
        if (i == 1 && this.catalog.length < 1) {
            this.loadCatalog();
        }
    }

    public tapRead(item?: IDocApi|IDocPage) {
        const route = [this.data().type > 0 ? '../../api' : '../../page', this.data().id];
        if (item) {
            route.push(0, item.id);
        }
        this.router.navigate(route, {relativeTo: this.route});
    }

    private loadCatalog() {
        this.service.catalogAll(this.data().id, 0).subscribe(res => {
            this.catalog.set(res.data);
        });
    }

}
