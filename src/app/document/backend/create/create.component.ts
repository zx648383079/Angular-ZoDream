import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IProject } from '../../model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        description: [''],
        status: [0],
    });

    public data: IProject = {
        type: 0,
        environment: [],
    } as any;

    public typeItems = [
        {
            name: '普通文档',
            icon: 'icon-book',
            desc: '支持代码高亮',
            value: 0,
        },
        {
            name: 'API文档',
            icon: 'icon-cloud',
            desc: '专用于API文档快速生成',
            value: 1,
        },
    ];

    constructor(
        private fb: FormBuilder,
        private service: DocumentService,
        private route: ActivatedRoute,
        private toastrService: ToastrService,
    ) { }

    ngOnInit() {
    }

    public tapType(item: any) {
        this.data.type = item.value;
    }

    public tapRemoveItem(i: number) {
        this.data.environment.splice(i, 1);
    }

    public tapAddItem() {
        this.data.environment.push({
            name: '',
            title: '',
            domain: ''
        });
    }
}
