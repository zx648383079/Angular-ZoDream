import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { PanelWidget, TreeEvent, TreeItem, TREE_ACTION, Widget } from '../../model';

@Component({
  selector: 'app-catalog-item',
  templateUrl: './catalog-item.component.html',
  styleUrls: ['./catalog-item.component.scss']
})
export class CatalogItemComponent implements OnInit, OnChanges {

    @ViewChild('input')
    public InputRef: ElementRef<HTMLInputElement>;

    @Input() public value: TreeItem;
    @Input() public level = 0;
    @Output() public tapped = new EventEmitter<TreeEvent>();
    public isWidget = false;

    constructor() { }

    public get headerStyle() {
        return {
            'padding-left': this.level * 30 + 'px' 
        };
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.value) {
            this.format();
        }
    }

    public tapEdit(e: MouseEvent) {
        e.stopPropagation();
        if (this.isWidget) {
            return;
        }
        this.value.onEdit = true;
        setTimeout(() => {
            if (this.InputRef) {
                this.InputRef.nativeElement.focus();
            }
        }, 100);
    }

    public tapContextMenu(e: MouseEvent) {
        e.stopPropagation();
        this.tapped.emit({
            action: TREE_ACTION.CONTEXT,
            data: this.value,
            event: e,
        });
        return false;
    }

    public tapFinish() {
        this.value.onEdit = false;
        this.tapped.emit({
            action: TREE_ACTION.EDIT,
            data: this.value
        });
    }

    public tapExpand(e: MouseEvent) {
        e.stopPropagation();
        if (this.value.canExpand) {
            this.value.expand = !this.value.expand;
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
            data: this.value
        });
    }

    public tapCopy() {
        this.tapped.emit({
            action: TREE_ACTION.COPY,
            data: this.value
        });
    }

    public tapTrash() {
        this.tapped.emit({
            action: TREE_ACTION.TRASH,
            data: this.value
        });
    }

    private format() {
        this.isWidget = this.value instanceof Widget;
        if (this.isWidget) {
            this.value.canExpand = this.value instanceof PanelWidget;
        }
        if (this.value.icon) {
            return;
        }
        this.value.icon = this.value.canExpand ? 'icon-folder-o' : 'icon-file-o';
    }
}
