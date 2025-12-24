import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewContainerRef, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContextMenuComponent, IMenuItem } from '../../../components/context-menu';
import { DialogEvent, DialogService } from '../../../components/dialog';
import { EditorService } from '../../../components/editor';
import { ButtonEvent } from '../../../components/form';
import { ThemeService } from '../../../theme/services';
import { parseNumber, wordLength } from '../../../theme/utils';
import { emptyValidate } from '../../../theme/validators';
import { BookService } from './book.service';
import { ChapterTypeItems, IBook, IChapter } from '../model';
import { IItem } from '../../../theme/models/seo';
import { TextElement } from './text-editor';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-book-editor',
    templateUrl: './book-editor.component.html',
    styleUrls: ['./book-editor.component.scss'],
})
export class BookEditorComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly service = inject(BookService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private renderer = inject(Renderer2);
    private readonly themeService = inject(ThemeService);
    private editor = inject(EditorService);


    public readonly contextMenu = viewChild(ContextMenuComponent);
    private readonly publishModal = viewChild<DialogEvent>('publishModal');
    private readonly moveModal = viewChild<DialogEvent>('moveModal');
    private readonly areaElement = viewChild<ElementRef<HTMLDivElement>>('editorArea');
    private readonly modalViewContainer = viewChild('modalVC', { read: ViewContainerRef });

    public book: IBook;
    public data: IChapter;
    public catalog: IChapter[] = [];
    public topVisible = false;

    public typeItems: IItem[] = ChapterTypeItems.filter(i => i.value < 9);
    public readonly bookForm = form(signal({
        name: '',
        cover: '',
        description: ''
    }));
    public readonly dataForm = form(signal({
        title: '',
        type: '0',
        size: '0',
        publish_type: 0,
        publish_date: '',
        publish_time: ''
    }));
    public readonly moveForm = form(signal({
        source: 0,
        target: '0',
        type: 0,
    }));
    
    constructor() {
        this.themeService.titleChanged.next('编辑书籍');
    }



    ngOnInit() {
        this.renderer.listen(document, 'keydown', (event: KeyboardEvent) => {
            if (event.ctrlKey && event.code === 'KeyS') {
                if (this.topVisible) {
                    this.tapSaveBook();
                    return;
                }
                if (this.data) {
                    this.tapSaveChapter();
                }
            }
        });
        this.route.params.subscribe(params => {
            this.loadBook(params.id);
        });
    }

    ngAfterViewInit(): void {
        this.editor.ready(new TextElement(this.areaElement().nativeElement, this.editor), this.modalViewContainer());
        this.editor.toggle(false);
    }

    ngOnDestroy(): void {
        this.editor.destroy();
    }

    private loadBook(id: any, only = false) {
        const expanded = [];
        for (const item of this.catalog) {
            if (item.type == 9 && item.expanded) {
                expanded.push(item.id);
            }
        }
        this.service.selfBook(id).subscribe({
            next: res => {
                this.catalog = res.chapters.map(i => {
                    if (i.type == 9 && !i.children) {
                        i.children = [];
                    }
                    if (i.type == 9) {
                        i.expanded = expanded.indexOf(i.id) >= 0;
                    }
                    return i;
                });
                this.book = {...res, chapters: undefined};
                this.bookForm().value.set({
                    name: res.name,
                    cover: res.cover,
                    description: res.description
                });
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public tapRefreshPosition() {
        this.toastrService.confirm('确定更新排序？', () => {
            this.service.selfRefreshPosition(this.book.id).subscribe(() => {
                this.toastrService.success('更新成功！');
                this.loadBook(this.book.id, true);
            });
        });
    }

    public tapExit() {
        history.back();
    }

    public tapEdit(item: IChapter) {
        if (item.type == 9) {
            item.expanded = !item.expanded;
            this.data = {...item};
            this.editor.toggle(false);
            return;
        }
        this.service.selfChapter(item.id).subscribe({
            next: res => {
                this.data = res;
                this.editor.toggle(res.type < 9);
                this.editor.value = res.content;
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public tapContextMenu(event: MouseEvent, parent?: IChapter) {
        return this.contextMenu().open(event, <IMenuItem[]>[
            {
                name: '新建卷',
                icon: 'icon-folder-o',
                onTapped: () => {
                    this.tapNewFolder();
                }
            },
            {
                name: '新建章节',
                icon: 'icon-file-text-o',
                onTapped: () => {
                    this.tapNewFile(parent ? (parent.type > 0 ? parent : {id: parent.parent_id} as any) : undefined);
                }
            },
            {
                name: '移动章节',
                icon: 'icon-arrow-up',
                disable: !parent,
                onTapped: () => {
                    this.tapMove(parent)
                }
            },
            {
                name: '删除',
                icon: 'icon-trash',
                disable: !parent,
                onTapped: () => {
                    this.tapRemove(parent);
                }
            },
        ].filter(i => !i.disable));
    }

    public tapNewFolder() {
        this.data = {
            title: '',
            type: 9,
        } as any;
        this.editor.toggle(false);
    }

    public tapNewFile(parent?: IChapter) {
        this.data = {
            title: '',
            type: 0,
            content: '',
            price: 0,
            position: 0,
            parent_id: parent ? parent.id : 0,
        } as any;
        this.editor.value = '';
        this.editor.toggle(true);
    }

    public tapSaveBook() {
        this.service.selfSaveBook({
            id: this.book.id,
            ...this.bookForm().value()
        }).subscribe(_ => {
            this.toastrService.success('书籍信息保存成功');
        });
    }

    public tapMove(item: IChapter) {
        this.moveForm.source().value.set(item.id);
        this.moveModal().open(() => {
            const data: any = {id: this.moveForm.source().value()};
            if (this.moveForm.type().value() < 9) {
                data.before = this.moveForm.target;
            } else {
                data.after = this.moveForm.target;
            }
            this.service.selfMoveChapter(data).subscribe({
                next: () => {
                    this.toastrService.success('移动成功');
                    this.loadBook(this.book.id, true);
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => {
            const target = parseNumber(this.moveForm.target().value());
            return target > 0 && target != item.id;
        }, `移动章节《${item.title}》到`);
    }

    public tapSaveChapter(e?: ButtonEvent) {
        if (!this.data || emptyValidate(this.data.title)) {
            this.toastrService.warning('请输入章节名');
            return;
        }
        const data = {...this.data} as any;
        const submitFn = () => {
            e?.enter();
            this.service.selfSaveChapter({...data, body: undefined, book_id: this.book.id}).subscribe({
                next: res => {
                    e?.reset();
                    this.data.id = res.id;
                    this.toastrService.success('章节保存成功');
                    if (res.type == 9) {
                        res.children = [];
                    }
                    this.appendItem(res);
                },
                error: err => {
                    e?.reset();
                    this.toastrService.error(err);
                }
            });
        };
        if (data.type == 9) {
            data.content = '';
            submitFn();
            return;
        }
        data.content = this.editor.value;
        this.data.size = data.size = wordLength(data.content);
        if (data.content.length < 1) {
            this.toastrService.warning('请输入内容');
            return;
        }
        this.publishModal().open(() => {
            const form = this.dataForm().value();
            data.publish_type = form.publish_type;
            if (data.publish_type > 0) {
                data.publish_at = `${form.publish_date} ${form.publish_time}`;
            }
            submitFn();
        }, () => {
            const data = this.dataForm().value();
            if (data.publish_type < 1) {
                return true;
            }
            return !emptyValidate(data.publish_date) && !emptyValidate(data.publish_time) ? true : '请选择发布的时间';
        });
    }

    public tapOver() {
        this.toastrService.confirm('确定要完结本书“' + this.book.name + '”？', () => {
            this.service.selfOverBook(this.book.id).subscribe(_ => {
                this.toastrService.success('已成功完结');
            });
        });
    }

    public tapRemove(item: IChapter) {
        this.toastrService.confirm('确定要删除“' + item.title + '”章节？', () => {
            this.service.selfRemoveChapter(item.id).subscribe(_ => {
                this.toastrService.success($localize `Delete Successfully`);
                this.removeItem(item);
            });
        });
    }

    private removeItem(item: IChapter) {
        const removeItem = (id: number, items: IChapter[]) => {
            for (let i = 0; i < items.length; i++) {
                const element = items[i];
                if (element.id === id) {
                    items.splice(i, 1);
                    return true;
                }
                if (element.children && removeItem(id, element.children)) {
                    return true;
                }
            }
            return false;
        };
        removeItem(item.id, this.catalog);
    }

    private appendItem(data: IChapter) {
        const findParent = (id: number, items: IChapter[]) => {
            if (id < 1 || !id) {
                return items;
            }
            for (const item of items) {
                if (item.id === id) {
                    if (!item.children) {
                        item.children = [];
                    }
                    return item.children;
                }
                if (!item.children || item.children.length < 1) {
                    continue;
                }
                const kids = findParent(id, item.children);
                if (kids) {
                    return kids;
                }
            }
        };
        const children = findParent(data.parent_id, this.catalog);
        for (const item of children) {
            if (item.id === data.id) {
                item.title = data.title;
                item.type = data.type;
                return;
            }
        }
        children.push(data);
    }

    public onDrog(source: {
        data: IChapter,
        before: boolean;
    }, item: IChapter) {
        this.service.selfMoveChapter({
            id: source.data.type === 9 && source.data.parent_id > 0 ? source.data.parent_id : source.data.id,
            [source.before ? 'before' : 'after']: item.id
        }).subscribe({
            next: () => {
                this.toastrService.success('移动成功');
                this.loadBook(this.book.id, true);
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }
    
}
