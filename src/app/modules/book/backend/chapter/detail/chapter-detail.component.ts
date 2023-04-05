import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IChapter } from '../../../model';
import { wordLength } from '../../../../../theme/utils';
import { BookService } from '../../book.service';
import { DialogService } from '../../../../../components/dialog';

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
        private toastrService: DialogService,
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

    public tapBack() {
        history.back();
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: IChapter = Object.assign({}, this.form.value) as any;
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        data.book_id = this.data.book_id;
        data.size = wordLength(data.content);
        this.service.chapterSave(data).subscribe(_ => {
            this.toastrService.success($localize `Save Successfully`);
            this.tapBack();
        });
    }
}
