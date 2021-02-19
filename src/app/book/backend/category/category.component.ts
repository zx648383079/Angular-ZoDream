import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ICategory } from '../../../theme/models/book';
import { BookService } from '../book.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

    public items: ICategory[] = [];
    public editData: ICategory;

    constructor(
        private service: BookService,
        private toastrService: ToastrService,
        private modalService: NgbModal,
    ) {}

    ngOnInit() {
        this.tapRefresh();
    }

    public open(content: any, item?: ICategory) {
        this.editData = item ? Object.assign({}, item) : {
            id: 0,
            name: '',
        };
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(value => {
            this.service.categorySave(this.editData).subscribe(_ => {
                this.toastrService.success('保存成功');
                this.tapRefresh();
            });
        });
    }

    public tapRefresh() {
        this.service.categoryList().subscribe(res => {
            this.items = res.data;
        });
    }

    public tapRemove(item: ICategory) {
        if (!confirm('确定删除“' + item.name + '”分类？')) {
            return;
        }
        this.service.categoryRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }
}
