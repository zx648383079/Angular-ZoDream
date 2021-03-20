import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IDocPage } from '../../model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-page-edit',
  templateUrl: './page-edit.component.html',
  styleUrls: ['./page-edit.component.scss']
})
export class PageEditComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        content: [''],
    });

    public data: IDocPage;

    constructor(
        private fb: FormBuilder,
        private service: DocumentService,
        private route: ActivatedRoute,
        private toastrService: ToastrService,
    ) { }

    ngOnInit() {
    }

}
