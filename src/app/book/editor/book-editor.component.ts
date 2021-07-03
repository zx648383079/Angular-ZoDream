import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContextMenuComponent, IMenuItem } from '../../context-menu';
import { DialogBoxComponent, DialogService } from '../../dialog';
import { ButtonEvent } from '../../form';
import { MindConfirmEvent, MindLinkSource, MindPointSource, MindUpdateEvent } from '../../mind';
import { PanelAnimation } from '../../theme/constants/panel-animation';
import { wordLength } from '../../theme/utils';
import { emptyValidate } from '../../theme/validators';
import { BookService } from '../book.service';
import { IBook, IBookRole, IBookRoleRelation, IChapter } from '../model';

@Component({
    selector: 'app-book-editor',
    templateUrl: './book-editor.component.html',
    styleUrls: ['./book-editor.component.scss'],
    animations: [
        PanelAnimation
    ],
})
export class BookEditorComponent implements OnInit {

    @ViewChild(ContextMenuComponent)
    public contextMenu: ContextMenuComponent;

    public book: IBook;
    public data: IChapter;
    public catalog: IChapter[] = [];
    public topVisible = false;
    public panelOpen = false;
    public subOpen = 0;
    public linkOpen = false;
    public roleItems: IBookRole[] = [];
    public linkItems: IBookRoleRelation[] = [];
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
    
    constructor(
        private service: BookService,
        private router: Router,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private renderer: Renderer2,
    ) { }

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
            this.service.selfBook(params.id).subscribe({
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
                    this.loadRole();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            })
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

    public tapEdit(item: IChapter) {
        if (item.type > 0) {
            item.expanded = !item.expanded;
            this.data = {...item};
            return;
        }
        this.service.selfChapter(item.id).subscribe({
            next: res => {
                this.data = res;
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
                    this.tapNewFile(parent);
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

    public tapSaveChapter(e?: ButtonEvent) {
        if (!this.data || emptyValidate(this.data.title)) {
            this.toastrService.warning('请输入章节名');
            return;
        }
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
                this.toastrService.success('删除成功');
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
