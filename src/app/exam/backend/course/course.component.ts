import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../dialog';
import { DialogBoxComponent } from '../../../dialog';
import { filterTree } from '../../../theme/utils';
import { emptyValidate } from '../../../theme/validators';
import { ICourse } from '../../model';
import { ExamService } from '../exam.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {

    public items: ICourse[] = [];
    public editData: ICourse = {} as any;
    public optionItems: ICourse[] = [];

    constructor(
        private service: ExamService,
        private toastrService: DialogService,
    ) {
        this.tapRefresh();
    }
  
    ngOnInit() {
    }

    public tapRefresh() {
        this.service.courseList().subscribe(res => {
            this.items = res.data;
        });
    }


    public open(modal: DialogBoxComponent, item?: ICourse) {
        this.editData = item ? {...item} : {
            id: 0,
            name: '',
            thumb: '',
            description: '',
            parent_id: 0,
        };
        this.optionItems = filterTree(this.items, this.editData.id);
        modal.open(() => {
            this.service.courseSave(this.editData).subscribe(_ => {
                this.toastrService.success('保存成功');
                this.tapRefresh();
            });
        }, () => !emptyValidate(this.editData.name));
    }
  
    public tapRemove(item: ICourse) {
        if (!confirm('确定删除“' + item.name + '”科目？')) {
            return;
        }
        this.service.courseRemove(item.id).subscribe(res => {
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
