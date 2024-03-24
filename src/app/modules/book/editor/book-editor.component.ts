import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContextMenuComponent, IMenuItem } from '../../../components/context-menu';
import { DialogBoxComponent, DialogEvent, DialogService } from '../../../components/dialog';
import { EditorService } from '../../../components/editor';
import { ButtonEvent } from '../../../components/form';
import { MindConfirmEvent, MindLinkSource, MindPointSource, MindUpdateEvent } from '../../../components/mind';
import { PanelAnimation } from '../../../theme/constants/panel-animation';
import { ThemeService } from '../../../theme/services';
import { wordLength } from '../../../theme/utils';
import { emptyValidate } from '../../../theme/validators';
import { BookService } from '../book.service';
import { IBook, IBookRole, IBookRoleRelation, IChapter } from '../model';
import { IItem } from '../../../theme/models/seo';
import { TextElement } from './text-editor';

@Component({
    selector: 'app-book-editor',
    templateUrl: './book-editor.component.html',
    styleUrls: ['./book-editor.component.scss'],
    animations: [
        PanelAnimation
    ],
})
export class BookEditorComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(ContextMenuComponent)
    public contextMenu: ContextMenuComponent;
    @ViewChild('moveModal')
    public moveModal: DialogEvent;
    @ViewChild('editorArea')
    private areaElement: ElementRef<HTMLDivElement>;
    @ViewChild('modalVC', {read: ViewContainerRef})
    private modalViewContainer: ViewContainerRef;

    public book: IBook;
    public data: IChapter;
    public catalog: IChapter[] = [];
    public topVisible = false;
    public panelOpen = false;
    public subOpen = 0;
    public linkOpen = false;
    public roleItems: IBookRole[] = [];
    public linkItems: IBookRoleRelation[] = [];
    public typeItems: IItem[] = [{name: '公众章节', value: 0}, {name: '收费章节', value: 0}];
    public roleIndex = -1;
    public roleData = {
        name: '',
        avatar: '',
        description: '',
        character: '',
        link: '',
        from: '',
        type: 'new'
    };
    public goodsData = {
        name: '',
        amount: 1,
    };
    public skillData = {
        name: '',
        level: '',
    };
    public moveData = {
        source: 0,
        target: 0,
        type: 0,
    };
    
    constructor(
        private service: BookService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private renderer: Renderer2,
        private themeService: ThemeService,
        private editor: EditorService
    ) {
        this.themeService.setTitle('编辑书籍');
    }

    public get goodsItems() {
        if (this.roleIndex < 0 || this.roleIndex >= this.roleItems.length) {
            return [];
        }
        return this.roleItems[this.roleIndex].goods_items || [];
    }

    public get skillItems() {
        if (this.roleIndex < 0 || this.roleIndex >= this.roleItems.length) {
            return [];
        }
        return this.roleItems[this.roleIndex].skill_items || [];
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
        this.editor.ready(new TextElement(this.areaElement.nativeElement, this.editor), this.modalViewContainer);
        this.editor.toggle(false);
    }

    ngOnDestroy(): void {
        this.editor.destroy();
    }

    private loadBook(id: any, only = false) {
        this.service.selfBook(id).subscribe({
            next: res => {
                this.catalog = res.chapters.map(i => {
                    if (i.type > 0 && !i.children) {
                        i.children = [];
                    }
                    if (i.type > 0) {
                        i.expanded = false;
                    }
                    return i;
                });
                this.book = {...res, chapters: undefined};
                if (only) {
                    return;
                }
                this.loadRole();
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

    public tapViewLink() {
        this.panelOpen = true;
        this.subOpen = 0;
    }

    public tapCloseLink() {
        this.linkOpen = this.panelOpen = false
    }

    public toggleLink() {
        this.linkOpen = !this.linkOpen;
        this.subOpen = 0;
    }

    public tapExit() {
        history.back();
    }

    public tapEdit(item: IChapter) {
        if (item.type > 0) {
            item.expanded = !item.expanded;
            this.data = {...item};
            this.editor.toggle(false);
            return;
        }
        this.service.selfChapter(item.id).subscribe({
            next: res => {
                this.data = res;
                this.editor.toggle(res.type < 1);
                this.editor.value = res.content;
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public tapContextMenu(event: MouseEvent, parent?: IChapter) {
        return this.contextMenu.show(event, <IMenuItem[]>[
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
            type: 1,
        } as any;
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
    }

    public tapSaveBook() {
        this.service.selfSaveBook({
            id: this.book.id,
            name: this.book.name,
            cover: this.book.cover,
            description: this.book.description,
        }).subscribe(_ => {
            this.toastrService.success('书籍信息保存成功');
        });
    }

    public tapMove(item: IChapter) {
        this.moveData.source = item.id;
        this.moveModal.open(() => {
            const data: any = {id: this.moveData.source};
            if (this.moveData.type < 1) {
                data.before = this.moveData.target;
            } else {
                data.after = this.moveData.target;
            }
            this.service.selfMoveChapter(data).subscribe({
                next: () => {
                    this.toastrService.success('移动成功');
                    this.loadBook(this.book.id, true);
                },
                error: err => {
                    this.toastrService.error(err);
                }
            })
        }, () => this.moveData.target > 0 && this.moveData.target != item.id, `移动章节《${item.title}》到`);
    }

    public tapSaveChapter(e?: ButtonEvent) {
        if (!this.data || emptyValidate(this.data.title)) {
            this.toastrService.warning('请输入章节名');
            return;
        }
        this.data.content = this.editor.value;
        if (this.data.type < 1 && this.data.content.length < 1) {
            this.toastrService.warning('请输入内容');
            return;
        }
        e?.enter();
        this.service.selfSaveChapter({...this.data, body: undefined, book_id: this.book.id, size: wordLength(this.data.content)}).subscribe({
            next: res => {
                e?.reset();
                this.data.id = res.id;
                this.toastrService.success('章节保存成功');
                if (res.type > 0) {
                    res.children = [];
                }
                this.appendItem(res);
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
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

    public openSubPanel(t: number, i: number) {
        this.subOpen = t;
        this.roleIndex = i;
    }

    public tapEditGoods(modal: DialogBoxComponent, i = -1) {
        this.goodsData = i >= 0 ? {
            name: this.goodsItems[i].name,
            amount: this.goodsItems[i].amount
        } : {
            name: '',
            amount: 1,
        };
        modal.open(() => {
            if (i < 0) {
                this.goodsItems.push({...this.goodsData});
                return;
            }
            this.goodsItems[i] = {...this.goodsData};
        }, () => !emptyValidate(this.goodsData.name));
    }

    public tapRemoveGoods(i: number) {
        this.goodsItems.splice(i, 1);
    }

    public tapEditSkill(modal: DialogBoxComponent, i = -1) {
        this.skillData = i >= 0 ? {
            name: this.skillItems[i].name,
            level: this.skillItems[i].level,
        } : {
            name: '',
            level: '',
        };
        modal.open(() => {
            if (i < 0) {
                this.skillItems.push({...this.skillData});
                return;
            }
            this.skillItems[i] = {...this.skillData};
        }, () => !emptyValidate(this.skillData.name));
    }

    public tapRemoveSkill(i: number) {
        this.skillItems.splice(i, 1);
    }

    public tapEditRole(modal: DialogBoxComponent, i: number) {
        const item = this.roleItems[i];
        this.roleData = {
            link: '',
            name: item.name,
            avatar: item.avatar,
            description: item.description,
            character: item.character,
            type: 'new',
            from: '',
        };
        modal.open(() => {
            this.service.roleSave({
                id: item.id,
                name: this.roleData.name,
                avatar: this.roleData.avatar,
                description: this.roleData.description,
                character: this.roleData.character,
            }).subscribe(res => {
                this.roleItems = this.roleItems.map(j => {
                    if (j.id === item.id) {
                        return res;
                    }
                    return j;
                });
            })
        }, '编辑角色');
    }

    public mindFormat(data: IBookRole&IBookRoleRelation) {
        if (data.name) {
            return <MindPointSource>{
                id: data.id || 0,
                text: data.name,
                x: data.x || 0,
                y: data.y || 0,
            };
        }
        return <MindLinkSource>{
            from: data.role_id || 0,
            to: data.role_link || 0,
            text: data.title,
        };
    }

    public onMindConfirm(event: MindConfirmEvent<IBookRole, IBookRoleRelation>, modal: DialogBoxComponent) {
        this.roleData = {
            link: '',
            name: event.to?.name || '',
            avatar: '',
            description: '',
            character: '',
            from: event.from?.name || '',
            type: event.type,
        };
        modal.open(() => {
            if (event.type === 'new') {
                this.service.roleSave({
                    book_id: this.book.id,
                    name: this.roleData.name,
                    avatar: this.roleData.avatar,
                    description: this.roleData.description,
                    character: this.roleData.character,
                    x: event.point?.x || 0,
                    y: event.point?.y || 0,
                }).subscribe(res => {
                    this.roleItems.push(res);
                    event.next(res);
                });
                return;
            }
            if (event.type === 'link') {
                this.service.LinkAdd(event.from.id, event.to.id, this.roleData.link).subscribe(res => {
                    event.next(res);
                });
                return;
            }
            this.service.roleSave({
                book_id: this.book.id,
                name: this.roleData.name,
                avatar: this.roleData.avatar,
                description: this.roleData.description,
                character: this.roleData.character,
                x: event.point?.x || 0,
                y: event.point?.y || 0,
                link_id: event.from?.id,
                link_title: this.roleData.link
            }).subscribe(res => {
                this.roleItems.push(res);
                event.next(res, {title: this.roleData.link, role_id: event.from?.id, role_link: res.id});
            });
        }, '添加角色与关系');
    }

    public onMindUpdate(event: MindUpdateEvent<IBookRole>) {
        if (event.type === 'delete') {
            this.service.roleRemove(event.source.id).subscribe(_ => {});
            return;
        }
        if (event.type === 'move') {
            this.service.roleSave({
                id: event.source.id,
                x: event.point.x,
                y: event.point.y
            }).subscribe(_ => {});
        }
    }

    private loadRole() {
        this.service.roleList(this.book.id).subscribe(res => {
            this.roleItems = res.items;
            this.linkItems = res.link_items;
        });
    }
}
