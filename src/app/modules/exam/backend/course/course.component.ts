import { Component, OnInit, inject, signal } from '@angular/core';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { filterTree } from '../../../../theme/utils';
import { ICourse } from '../../model';
import { ExamService } from '../exam.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
    private readonly service = inject(ExamService);
    private readonly toastrService = inject(DialogService);


    public readonly items = signal<ICourse[]>([]);
    public readonly isLoading = signal(false);
    public readonly editForm = form(signal({
        id: 0,
        name: '',
        thumb: '',
        description: '',
        parent_id: '0',
    }), schemaPath => {
        required(schemaPath.name);
    });
    public readonly optionItems = signal<ICourse[]>([]);

    constructor() {
        this.tapRefresh();
    }
  
    ngOnInit() {
    }

    public tapRefresh() {
        this.isLoading.set(true);
        this.service.courseList().subscribe({
            next: res => {
                this.items.set(res.data);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }


    public open(modal: DialogEvent, item?: ICourse) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.thumb = item?.thumb ?? '';
            v.description = item?.description ?? '';
            v.parent_id = item?.parent_id as any ?? '0';
            return {...v};
        });
        this.optionItems.set(filterTree(this.items(), this.editForm.id().value()));
        modal.open(() => {
            this.service.courseSave(this.editForm().value()).subscribe(_ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapRefresh();
            });
        }, () => this.editForm().valid());
    }
  
    public tapRemove(item: ICourse) {
        this.toastrService.confirm('确定删除“' + item.name + '”科目, 请注意移动科目下的题目？', () => {
            this.service.courseRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items.update(v => {
                    return v.filter(it => {
                        return it.id !== item.id;
                    });
                });
            });
        });
    }

}
