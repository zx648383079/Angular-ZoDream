import { Component, inject, input, signal } from '@angular/core';
import { DialogBoxComponent } from '../../../../components/dialog';
import { MindPointSource, MindLinkSource, MindConfirmEvent, MindUpdateEvent } from '../../../../components/mind';
import { emptyValidate } from '../../../../theme/validators';
import { IBookRole, IBookRoleRelation } from '../../model';
import { BookService } from '../book.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-editor-role-panel',
    templateUrl: './editor-role-panel.component.html',
    styleUrls: ['./editor-role-panel.component.scss'],
})
export class EditorRolePanelComponent {
    private readonly service = inject(BookService);


    public visible = false;
    public readonly targetId = input(0);
    public subOpen = 0;
    public linkOpen = false;
    public roleItems: IBookRole[] = [];
    public linkItems: IBookRoleRelation[] = [];
    public roleIndex = -1;
    public readonly roleForm = form(signal({
        name: '',
        avatar: '',
        description: '',
        character: '',
        link: '',
        from: '',
        type: 'new'
    }), schemaPath => {
        required(schemaPath.name);
    });
    public readonly goodsForm = form(signal({
        name: '',
        amount: 1,
    }), schemaPath => {
        required(schemaPath.name);
    });
    public readonly skillForm = form(signal({
        name: '',
        level: '',
    }), schemaPath => {
        required(schemaPath.name);
    });
    private booted = false;

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

    public open() {
        this.visible = true;
        this.subOpen = 0;
        if (this.booted) {
            return;
        }
        this.booted = true;
        this.loadRole();
    } 

    public close() {
        this.linkOpen = this.visible = false
    }

    public toggleLink() {
        this.linkOpen = !this.linkOpen;
        this.subOpen = 0;
    }

    public openSubPanel(t: number, i: number) {
        this.subOpen = t;
        this.roleIndex = i;
    }

    public tapEditGoods(modal: DialogBoxComponent, i = -1) {
        this.goodsForm().value.set(i >= 0 ? {
            name: this.goodsItems[i].name,
            amount: this.goodsItems[i].amount
        } : {
            name: '',
            amount: 1,
        });
        modal.open(() => {
            if (i < 0) {
                this.goodsItems.push({...this.goodsForm().value()});
                return;
            }
            this.goodsItems[i] = {...this.goodsForm().value()};
        }, () => this.goodsForm().valid());
    }

    public tapRemoveGoods(i: number) {
        this.goodsItems.splice(i, 1);
    }

    public tapEditSkill(modal: DialogBoxComponent, i = -1) {
        this.skillForm().value.set(i >= 0 ? {
            name: this.skillItems[i].name,
            level: this.skillItems[i].level,
        } : {
            name: '',
            level: '',
        });
        modal.open(() => {
            if (i < 0) {
                this.skillItems.push({...this.skillForm().value()});
                return;
            }
            this.skillItems[i] = {...this.skillForm().value()};
        }, () => this.skillForm().valid());
    }

    public tapRemoveSkill(i: number) {
        this.skillItems.splice(i, 1);
    }

    public tapEditRole(modal: DialogBoxComponent, i: number) {
        const item = this.roleItems[i];
        this.roleForm().value.set({
            link: '',
            name: item.name,
            avatar: item.avatar,
            description: item.description,
            character: item.character,
            type: 'new',
            from: '',
        });
        modal.open(() => {
            this.service.roleSave({
                id: item.id,
                ...this.roleForm().value()
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
        this.roleForm().value.set({
            link: '',
            name: event.to?.name || '',
            avatar: '',
            description: '',
            character: '',
            from: event.from?.name || '',
            type: event.type,
        });
        modal.open(() => {
            if (event.type === 'new') {
                this.service.roleSave({
                    book_id: this.targetId(),
                   ...this.roleForm().value(),
                    x: event.point?.x || 0,
                    y: event.point?.y || 0,
                }).subscribe(res => {
                    this.roleItems.push(res);
                    event.next(res);
                });
                return;
            }
            if (event.type === 'link') {
                this.service.LinkAdd(event.from.id, event.to.id, this.roleForm.link().value()).subscribe(res => {
                    event.next(res);
                });
                return;
            }
            this.service.roleSave({
                book_id: this.targetId(),
                ...this.roleForm().value(),
                x: event.point?.x || 0,
                y: event.point?.y || 0,
                link_id: event.from?.id,
                link_title: this.roleForm.link().value()
            }).subscribe(res => {
                this.roleItems.push(res);
                event.next(res, {title: this.roleForm.link().value(), role_id: event.from?.id, role_link: res.id});
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
        this.service.roleList(this.targetId()).subscribe(res => {
            this.roleItems = res.items;
            this.linkItems = res.link_items;
        });
    }
}
