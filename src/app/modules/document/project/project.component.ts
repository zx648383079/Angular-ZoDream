import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from '../document.service';
import { IDocApi, IDocPage, IProject } from '../model';

@Component({
    standalone: false,
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

    public data: IProject;
    public catalog: IDocPage[]&IDocApi[] = [];
    public tabIndex = 0;

    constructor(
        private service: DocumentService,
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.project(params.id).subscribe(res => {
                this.data = res;
                this.loadCatalog();
            });
        });
    }

    public tapTab(i: number) {
        this.tabIndex = i;
        if (i == 1 && this.catalog.length < 1) {
            this.loadCatalog();
        }
    }

    public tapRead(item?: IDocApi|IDocPage) {
        const route = [this.data.type > 0 ? '../../api' : '../../page', this.data.id];
        if (item) {
            route.push(0, item.id);
        }
        this.router.navigate(route, {relativeTo: this.route});
    }

    private loadCatalog() {
        this.service.catalogAll(this.data.id, 0).subscribe(res => {
            this.catalog = res.data;
        });
    }

}
