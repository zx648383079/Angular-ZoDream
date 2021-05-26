import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../dialog';
import { IItem } from '../../../theme/models/seo';
import { IBook, ICategory } from '../../model';
import { BookService } from '../book.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        cat_id: [0, Validators.required],
        author_id: [0, Validators.required],
        classify: [0],
        source: [''],
        cover: [''],
        description: [''],
        status: [0],
    });

    public data: IBook;
    public categories: ICategory[] = [];
    public classifyItems: IItem[] = [
        {name: '无分级', value: 0},
        {name: '成人级', value: 18},
    ];
    public statusItems: IItem[] = [
        {name: '审核中', value: 0},
        {name: '已审核', value: 1},
        {name: '已拒绝', value: 9},
    ];

    constructor(
        private fb: FormBuilder,
        private service: BookService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) {}

    ngOnInit() {
        this.service.categoryList().subscribe(res => {
            this.categories = res.data;
        });
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.book(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
                    name: res.name,
                    cat_id: res.cat_id,
                    author_id: res.author_id,
                    classify: res.classify,
                    source: res.source,
                    cover: res.cover,
                    description: res.description,
                    status: res.status,
                });
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: IBook = Object.assign({}, this.form.value);
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        this.service.bookSave(data).subscribe(_ => {
            this.toastrService.success('保存成功');
            this.tapBack();
        });
    }
}
