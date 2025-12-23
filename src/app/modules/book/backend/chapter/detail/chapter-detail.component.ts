import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChapterTypeItems, IChapter } from '../../../model';
import { wordLength } from '../../../../../theme/utils';
import { BookService } from '../../book.service';
import { DialogService } from '../../../../../components/dialog';
import { ButtonEvent } from '../../../../../components/form';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-chapter-detail',
    templateUrl: './chapter-detail.component.html',
    styleUrls: ['./chapter-detail.component.scss']
})
export class ChapterDetailComponent implements OnInit {
    private readonly service = inject(BookService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly dataModel = signal({
        id: 0,
        title: '',
        content: '',
        type: '',
        price: 0,
        source: '',
        position: 99,
        book_id: 0,
        size: 0,
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.title);
        required(schemaPath.content);
    });

    public typeItems = ChapterTypeItems;

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.book) {
                history.back();
                return;
            }
            if (!params.id) {
                this.dataModel.update(v => {
                    v.book_id = params.book,
                    v.size = 0;
                    return v;
                })
                return;
            }
            this.service.chapter(params.id).subscribe(res => {
                this.dataModel.set({
                    id: res.id,
                    type: res.type as any,
                    title: res.title,
                    content: res.content,
                    price: res.price,
                    source: res.source,
                    position: res.position,
                    book_id: params.book,
                    size: 0
                });
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit2(e: SubmitEvent) {
        e.preventDefault();
        this.tapSubmit();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: IChapter = this.dataForm().value() as any;
        data.size = wordLength(data.content);
        e?.enter();
        this.service.chapterSave(data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Save Successfully`);
                this.tapBack();
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }
}
