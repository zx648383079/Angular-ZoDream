import { Component, ElementRef, OnInit, inject, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContextMenuComponent } from '../../../components/context-menu';
import { DialogEvent, DialogService } from '../../../components/dialog';
import { ButtonEvent } from '../../../components/form';
import { IItem } from '../../../theme/models/seo';
import { ThemeService } from '../../../theme/services';
import { mapFormat } from '../../../theme/utils';
import { emptyValidate } from '../../../theme/validators';
import { ExamService } from '../exam.service';
import { ICourse, IExamPage, IQuestion, QuestionTypeItems } from '../model';
import { questionNeedOption } from '../util';

@Component({
    standalone: false,
    selector: 'app-page-editor',
    templateUrl: './page-editor.component.html',
    styleUrls: ['./page-editor.component.scss']
})
export class PageEditorComponent implements OnInit {
    private readonly service = inject(ExamService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly themeService = inject(ThemeService);


    public readonly contextMenu = viewChild(ContextMenuComponent);
    public readonly scrollBar = viewChild<ElementRef<HTMLDivElement>>('scrollBar');
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

    ngOnInit() {
        this.service.courseAll().subscribe(res => {
            this.courseItems = res.data;
        });
        this.route.params.subscribe(params => {
            this.data.course_id = parseInt(params.course, 10);
            if (!params.id) {
                this.onCourseChange();
                return;
            }
            this.service.page(params.id).subscribe(res => {
                this.data = {...this.data, ...res};
                this.items = res.rule_value as any;
                this.onCourseChange();
                this.tapEdit(0);
            });
        });
        this.tapAdd();
    }

    public formatQuestionType(value: number) {
        return mapFormat(value, QuestionTypeItems);
    }

    private checkQuestion(items: IQuestion[]): boolean {
        for (const item of items) {
            if (item.type === 5) {
                if (!item.children || item.children.length < 0) {
                    return false;
                }
                if (!this.checkQuestion(item.children)) {
                    return false;
                }
            }
            if (item.type > 1) {
                continue;
            }
            if (!item.option_items || item.option_items.length < 1 || item.option_items.filter(j => j.is_right).length < 1) {
                return false;
            }
        }
        return true;
    }

    public tapSubmit(e?: ButtonEvent) {
        if (emptyValidate(this.data.name)) {
            this.toastrService.warning('请输入试卷标题');
            return;
        }
        if (!this.checkQuestion(this.items)) {
            this.toastrService.warning('有部分题目未输入完整！');
            return;
        }
        const items = this.items.filter(i => {
            if (emptyValidate(i.title)) {
                return false;
            }
            if (!questionNeedOption(i)) {
                return true;
            }
            return i.option_items && i.option_items.length > 0 && i.option_items.filter(j => j.is_right).length > 0;
        }).map(i => {
            i.option_items = i.option_items ? i.option_items?.filter(j => !emptyValidate(j.content)) : [];
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
            rule_value: undefined,
            question_items: items
        }).subscribe({
            next: res => {
                this.data = {...this.data, ...res};
                this.items = res.rule_value as any;
                e?.reset();
                this.toastrService.success($localize `Save Successfully`);
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
                if (err.error.code === 401) {
                    this.themeService.emitLogin(false);
                }
            }
        });
    }

    public tapAdd() {
        this.editItem = {
            title: '',
            content: '',
            score: '',
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
        return this.contextMenu().show(event, [
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
            const ele = this.scrollBar().nativeElement;
            ele.scrollTo({
                top: ele.scrollHeight + 300
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
