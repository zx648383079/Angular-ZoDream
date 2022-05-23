import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../theme/services';
import { DocumentService } from './document.service';
import { IProject } from './model';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {

    public items: IProject[] = [];

    constructor(
        private service: DocumentService,
        private themeService: ThemeService,
    ) { }

    ngOnInit() {
        this.themeService.setTitle($localize `Document`);
        this.service.projectList({}).subscribe(res => {
            this.items = res.data;
        });
    }

}
