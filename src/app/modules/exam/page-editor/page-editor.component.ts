import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContextMenuComponent } from '../../../components/context-menu';
import { DialogEvent, DialogService } from '../../../components/dialog';
import { ButtonEvent } from '../../../components/form';
import { IItem } from '../../../theme/models/seo';
import { SearchService, ThemeService } from '../../../theme/services';
import { findIndex } from '../../../theme/utils';
import { emptyValidate } from '../../../theme/validators';
import { ExamService } from '../exam.service';
import { ICourse, IQuestion } from '../model';
import { questionNeedOption } from '../util';
import { form, required } from '@angular/forms/signals';
import { QuestionFinderComponent } from '../components';

@Component({
    standalone: false,
    selector: 'app-page-editor',
    templateUrl: './page-editor.component.html',
    styleUrls: ['./page-editor.component.scss']
})
export class PageEditorComponent {
    private readonly service = inject(ExamService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly themeService = inject(ThemeService);
    private readonly searchService = inject(SearchService);


    public readonly contextMenu = viewChild(ContextMenuComponent);
    public readonly scrollBar = viewChild<ElementRef<HTMLDivElement>>('scrollBar');
    public readonly items = signal<IQuestion[]>([]);
    public editItem: IQuestion;
    public editIndex = -1;
    public readonly dataForm = form(signal({
        name: '',
        limit_time: 120,
        course_id: '',
        course_grade: '1',
        start_at: '',
        end_at: '',
    }), schemaPath => {
        required(schemaPath.name);
    });

    public readonly courseItems = signal<ICourse[]>([]);
    public readonly gradeItems = signal<IItem[]>([]);

    constructor() {
        this.service.courseAll().subscribe(res => {
            this.courseItems.set(res.data);
        });
        this.route.params.subscribe(params => {
            this.dataForm.course_id().value.set(parseInt(params.course, 10) as any);
            if (!params.id) {
                this.onCourseChange();
                return;
            }
            this.service.page(params.id).subscribe(res => {
                this.dataForm().value.update(v => {
                    return this.searchService.getQueries(res, v);
                });
                this.items.set(res.rule_value as any);
                this.onCourseChange();
                this.tapEdit(0);
            });
        });
        this.tapAdd();
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
        if (this.dataForm().invalid()) {
            this.toastrService.warning('请输入试卷标题');
            return;
        }
        if (!this.checkQuestion(this.items())) {
            this.toastrService.warning('有部分题目未输入完整！');
            return;
        }
        const data = this.dataForm().value();
        const items = this.items().filter(i => {
            if (emptyValidate(i.title)) {
                return false;
            }
            if (!questionNeedOption(i)) {
                return true;
            }
            return i.option_items && i.option_items.length > 0 && i.option_items.filter(j => j.is_right).length > 0;
        }).map(i => {
            i.option_items = i.option_items ? i.option_items?.filter(j => !emptyValidate(j.content)) : [];
            i.course_id = data.course_id as any;
            i.course_grade = data.course_grade as any;
            return i;
        });
        if (items.length < 1) {
            this.toastrService.warning('请输入添加完整的题目，必须包含一个正确的选项');
            return;
        } 
        e?.enter();
        this.service.pageSave({
            ...data,
            rule_value: undefined,
            question_items: items
        }).subscribe({
            next: res => {
                this.dataForm().value.update(v => this.searchService.getQueries(res, v));
                this.items.set(res.rule_value as any);
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
        this.items.update(v => {
            v.push(this.editItem);
            return [...v];
        });
        this.editIndex = this.items().length - 1;
        this.scrollBottom();
    }

    public tapFind(modal: QuestionFinderComponent) {
        modal.open([], (items: IQuestion[]) => {
            this.items.update(v => {
                return [...v, ...items.filter(i => findIndex(v, j => j.id === i.id) < 0)]
            });
        }, items => items.length > 0, params => {
            return this.service.search({
                type: 1,
                ...params,
                full: true
            })
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
        this.items.update(v => {
            v.splice(i, 1);
            return [...v];
        });
        if (this.items().length < 1) {
            this.tapAdd();
            return;
        }
        if (i !== this.editIndex) {
            return;
        }
        if (i < this.items().length) {
            this.tapEdit(i);
            return;
        }
        this.tapEdit(i - 1);
    }

    public tapContextMenu(event: MouseEvent, i: number) {
        return this.contextMenu().open(event, [
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
            course: this.dataForm.course_id().value(),
        }).subscribe(res => {
            this.gradeItems.set(res.data);
        });
    }

}
