import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogService } from '../../../../components/dialog';

@Component({
    selector: 'app-catering-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

    @Input() public items: any[] = [];
    @Input() public selected = 0;
    @Input() public header = $localize `Category`;

    public isEditable = false;

    @Output() public selectedChange = new EventEmitter<number>();
    @Output() public add = new EventEmitter();
    @Output() public edit = new EventEmitter<any>();
    @Output() public remove = new EventEmitter<any>();

    constructor(
        private toastrService: DialogService,
    ) { }


    public toggleEdit() {
        this.isEditable = !this.isEditable;
    }

    public tapSelect(item?: any) {
        if (!this.isEditable) {
            this.selectedChange.emit(this.selected = item ? item.id : 0);
            return;
        }
        if (item) {
            this.edit.emit(item);
            return;
        }
        this.add.emit();
    }

    public tapRemove(item: any) {
        this.toastrService.confirm($localize `Are you sure to remove ${item.name}?`, () => {
            this.remove.emit(item);
        });
    }
}
