import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
    });

    public data: IBook;
    public categories: ICategory[] = [];

    constructor(
        private fb: FormBuilder,
        private service: BookService,
        private route: ActivatedRoute,
        private toastrService: ToastrService,
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
