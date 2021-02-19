import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IChapter } from '../../../../theme/models/book';
import { wordLength } from '../../../../theme/utils';
import { BookService } from '../../book.service';

@Component({
  selector: 'app-chapter-detail',
  templateUrl: './chapter-detail.component.html',
  styleUrls: ['./chapter-detail.component.scss']
})
export class ChapterDetailComponent implements OnInit {

    public form = this.fb.group({
        title: ['', Validators.required],
        content: ['', Validators.required],
        price: [0],
        source: [''],
        position: [99],
    });

    public data: IChapter;

    constructor(
        private fb: FormBuilder,
        private service: BookService,
        private route: ActivatedRoute,
        private toastrService: ToastrService,
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.book) {
                history.back();
                return;
            }
            this.data = {book_id: params.book, size: 0} as any;
            if (!params.id) {
                return;
            }
            this.service.chapter(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
                    title: res.title,
                    content: res.content,
                    price: res.price,
                    source: res.source,
                    position: res.position,
                });
            });
        });
    }

    get size() {
        return wordLength(this.form.get('content').value);
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: IChapter = Object.assign({}, this.form.value);
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        data.book_id = this.data.book_id;
        data.size = this.size;
        this.service.chapterSave(data).subscribe(_ => {
            this.toastrService.success('保存成功');
            this.tapBack();
        });
    }
}
