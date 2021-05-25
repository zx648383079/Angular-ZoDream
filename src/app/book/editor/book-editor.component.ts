import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContextMenuComponent, IMenuItem } from '../../context-menu';
import { DialogService } from '../../dialog';
import { wordLength } from '../../theme/utils';
import { emptyValidate } from '../../theme/validators';
import { BookService } from '../book.service';
import { IBook, IChapter } from '../model';

@Component({
  selector: 'app-book-editor',
  templateUrl: './book-editor.component.html',
  styleUrls: ['./book-editor.component.scss']
})
export class BookEditorComponent implements OnInit {

    @ViewChild(ContextMenuComponent)
    public contextMenu: ContextMenuComponent;

    public book: IBook;
    public data: IChapter;
    public catalog: IChapter[] = [];
    public topVisible = false;
    
    constructor(
        private service: BookService,
        private router: Router,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private renderer: Renderer2,
    ) { }

    public get size() {
        if (!this.data) {
            return 0;
        }
        return wordLength(this.data.content);
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
                    this.catalog = res.chapters;
                    this.book = {...res, chapters: undefined};
                },
                error: err => {
                    this.toastrService.error(err);
                }
            })
        });
    }

    public tapEdit(item: IChapter) {
        if (item.type > 0) {
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

    public tapSaveChapter() {
        if (!this.data || emptyValidate(this.data.title)) {
            this.toastrService.warning('请输入内容');
            return;
        }
        this.service.selfSaveChapter({...this.data, book_id: this.book.id}).subscribe({
            next: res => {
                this.data.id = res.id;
                this.toastrService.success('章节保存成功');
                this.appendItem(res);
            },
            error: err => {
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
            if (id < 1) {
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

}