import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IItem } from '../../../../theme/models/seo';
import { IBook, ICategory } from '../../model';
import { BookService } from '../book.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
    private readonly service = inject(BookService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly dataModel = signal({
        id: 0,
        name: '',
        cat_id: '',
        author_id: 0,
        classify: '',
        source: '',
        cover: '',
        description: '',
        status: '',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
        required(schemaPath.cat_id);
        required(schemaPath.author_id);
    });

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

    ngOnInit() {
        this.service.categoryList().subscribe(res => {
            this.categories = res.data;
        });
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.book(params.id).subscribe(res => {
                this.dataModel.set({
                    id: res.id,
                    name: res.name,
                    cat_id: res.cat_id as any,
                    author_id: res.author_id,
                    classify: res.classify as any,
                    source: res.source,
                    cover: res.cover,
                    description: res.description,
                    status: res.status as any,
                });
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit() {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: IBook = this.dataForm().value() as any;
        this.service.bookSave(data).subscribe(_ => {
            this.toastrService.success($localize `Save Successfully`);
            this.tapBack();
        });
    }
}
