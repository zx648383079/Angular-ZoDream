import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContextMenuComponent } from '../../../context-menu';
import { DialogEvent, DialogService } from '../../../dialog';
import { ButtonEvent } from '../../../form';
import { IItem } from '../../../theme/models/seo';
import { mapFormat } from '../../../theme/utils';
import { emptyValidate } from '../../../theme/validators';
import { ExamService } from '../../exam.service';
import { ICourse, IExamPage, IQuestion } from '../../model';

@Component({
  selector: 'app-edit-pager',
  templateUrl: './edit-pager.component.html',
  styleUrls: ['./edit-pager.component.scss']
})
export class EditPagerComponent implements OnInit {
    @ViewChild(ContextMenuComponent)
    public contextMenu: ContextMenuComponent;
    @ViewChild('scrollBar')
    public scrollBar: ElementRef<HTMLDivElement>;
    public items: IQuestion[] = [];
    public editItem: IQuestion;
    public editIndex = -1;
    public data: IExamPage = {
        name: '',
        limit_time: 120,
        course_id: 0,
        course_grade: 1,
        start_at: '',
        end_at: '',
    } as any;

    public courseItems: ICourse[] = [];
    public gradeItems: IItem[] = [];
    public dialogData = {
        items: [],
        page: 1,
        perPage: 20,
        total: 0,
        keywords: '',
        course: 0,
    };

    constructor(
        private service: ExamService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
        this.service.courseAll().subscribe(res => {
            this.courseItems = res.data;
        });
        this.route.params.subscribe(params => {
            this.data.course_id = parseInt(params.course, 10);
            this.onCourseChange();
        });
        this.tapAdd();
    }

    public formatQuestionType(value: number) {
        return mapFormat(value, ['单选题', '多选题', '判断题', '简答题', '填空题']);
    }

    public tapSubmit(e?: ButtonEvent) {
        if (emptyValidate(this.data.name)) {
            this.toastrService.warning('请输入试卷标题');
            return;
        }
        const items = this.items.filter(i => {
            return !emptyValidate(i.title) && i.option_items.length > 0 || i.option_items.filter(j => j.is_right).length < 1;
        }).map(i => {
            i.option_items = i.option_items.filter(j => !emptyValidate(j.content))
            if (i.option_items.length == 1) {
                i.type = 3;
                i.answer = i.option_items[0].content;
                i.option_items = [];
            } else if (i.option_items.length == 2 && i.option_items[0].content === '对' && i.option_items[1].content === '错') {
                i.type = 2;
                i.answer = i.option_items[0].is_right ? 1 : 0;
                i.option_items = [];
            }
            i.course_id = this.data.course_id;
            i.course_grade = this.data.course_grade;
            return i;
        });
        if (items.length < 1) {
            this.toastrService.warning('请输入添加完整的题目，必须包含一个正确的选项');
            return;
        } 
        e?.enter();
        this.service.pageSave({
            ...this.data,
            question_items: items
        }).subscribe({
            next: res => {
                this.data = res;
                this.items = res.rule_value as any;
                e?.reset();
                this.toastrService.success('保存成功');
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }

    public tapAdd() {
        this.editItem = {
            content: '',
        } as any;
        this.items.push(this.editItem);
        this.editIndex = this.items.length - 1;
        this.scrollBottom();
    }

    public tapFind(modal: DialogEvent) {
        modal.open(() => {
            for (const item of this.dialogData.items) {
                if (item.selected && this.indexOf(item.id) < 0) {
                    this.items.push(item);
                }
            }
        });
    }

    public tapEditFull(modal: DialogEvent) {
        modal.open();
    }

    public tapEdit(i: number) {
        this.editItem = this.items[i];
        this.editIndex = i;
    }

    public onValueChange(value: IQuestion) {
        this.editItem = value;
        this.items[this.editIndex] = value;
    }

    public tapRemove(i: number) {
        this.items.splice(i, 1);
        if (this.items.length < 1) {
            this.tapAdd();
            return;
        }
        if (i !== this.editIndex) {
            return;
        }
        if (i < this.items.length) {
            this.tapEdit(i);
            return;
        }
        this.tapEdit(i - 1);
    }

    public tapContextMenu(event: MouseEvent, i: number) {
        return this.contextMenu.show(event, [
            {
                name: '新增',
                icon: 'icon-plus',
                onTapped: () => {
                    this.tapAdd();
                }
            },
            {
                name: '编辑',
                icon: 'icon-edit',
                onTapped: () => {
                    this.tapEdit(i);
                }
            },
            {
                name: '删除',
                icon: 'icon-trash',
                onTapped: () => {
                    this.tapRemove(i);
                }
            },
        ]);
    }

    private scrollBottom() {
        setTimeout(() => {
            const ele = this.scrollBar.nativeElement;
            ele.scrollTo({
                top: ele.clientHeight + 300
            });
        }, 100);
    }

    public onCourseChange() {
        this.service.gradeAll({
            course: this.data.course_id,
        }).subscribe(res => {
            this.gradeItems = res.data;
        });
    }

    public tapDialogPage() {
        this.service.search({
            type: 1,
            keywords: this.dialogData.keywords,
            course: this.dialogData.course,
            page: this.dialogData.page,
            per_page: this.dialogData.perPage,
            full: true
        }).subscribe(res => {
            this.dialogData.items = res.data;
            this.dialogData.total = res.paging.total;
        });
    }

    public tapDialogSearch(form: any) {
        this.dialogData.keywords = form.keywords;
        this.dialogData.course = form.course;
        this.dialogData.page = 1;
        this.tapDialogPage();
    }

    private indexOf(id: number): number {
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (item.id === id) {
                return i;
            }
        }
        return -1;
    } 

}
