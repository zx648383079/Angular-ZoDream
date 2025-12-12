import { Component, ElementRef, effect, input, output, viewChild } from '@angular/core';
import { PanelWidget, TreeEvent, TreeItem, TREE_ACTION, Widget } from '../../model';

@Component({
    standalone: false,
    selector: 'app-catalog-item',
    templateUrl: './catalog-item.component.html',
    styleUrls: ['./catalog-item.component.scss']
})
export class CatalogItemComponent {

    public readonly InputRef = viewChild<ElementRef<HTMLInputElement>>('input');

    public readonly value = input<TreeItem>(undefined);
    public readonly level = input(0);
    public readonly tapped = output<TreeEvent>();
    public isWidget = false;

    constructor() {
        effect(() => {
            this.value();
            this.format();
        });
    }

    public get headerStyle() {
        return {
            'padding-left': this.level() * 30 + 'px' 
        };
    }

    public tapEdit(e: MouseEvent) {
        e.stopPropagation();
        if (this.isWidget) {
            return;
        }
        this.value().onEdit = true;
        setTimeout(() => {
            const InputRef = this.InputRef();
            if (InputRef) {
                InputRef.nativeElement.focus();
            }
        }, 100);
    }

    public tapContextMenu(e: MouseEvent) {
        e.stopPropagation();
        this.tapped.emit({
            action: TREE_ACTION.CONTEXT,
            data: this.value(),
            event: e,
        });
        return false;
    }

    public tapFinish() {
        const value = this.value();
        value.onEdit = false;
        this.tapped.emit({
            action: TREE_ACTION.EDIT,
            data: value
        });
    }

    public tapExpand(e: MouseEvent) {
        e.stopPropagation();
        const value = this.value();
        if (value.canExpand) {
            value.expand = !value.expand;
        }
    }

    public onKeyDown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            this.tapFinish();
        }
    }

    public tapSetHome() {
        this.tapped.emit({
            action: TREE_ACTION.HOME,
            data: this.value()
        });
    }

    public tapCopy() {
        this.tapped.emit({
            action: TREE_ACTION.COPY,
            data: this.value()
        });
    }

    public tapTrash() {
        this.tapped.emit({
            action: TREE_ACTION.TRASH,
            data: this.value()
        });
    }

    private format() {
        this.isWidget = this.value() instanceof Widget;
        const value = this.value();
        if (this.isWidget) {
            value.canExpand = value instanceof PanelWidget;
        }
        if (value.icon) {
            return;
        }
        value.icon = value.canExpand ? 'icon-folder-o' : 'icon-file-o';
    }
}
