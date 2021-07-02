import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContextMenuComponent } from '../../../context-menu';
import { DialogService } from '../../../dialog';
import { emptyValidate } from '../../../theme/validators';
import { ExamService } from '../../exam.service';
import { IQuestion } from '../../model';

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
    public name = '';
    public limitTime = 120;
    private course = 0;

    constructor(
        private service: ExamService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.course = parseInt(params.course, 10);
        });
        this.tapAdd();
    }

    public tapSubmit() {
        if (emptyValidate(this.name)) {
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
            i.course_id = this.course;
            return i;
        });
        if (items.length < 1) {
            this.toastrService.warning('请输入添加完整的题目，必须包含一个正确的选项');
            return;
        } 
        this.service.pageSave({
            name: this.name,
            limit_time: this.limitTime,
            question_items: items
        }).subscribe(_ => {
            this.toastrService.success('保存成功');
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

    public tapFind() {
        
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

}
