import { Component, inject, input, model, output } from '@angular/core';
import { DialogService } from '../../../../components/dialog';

@Component({
    standalone: false,
    selector: 'app-catering-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
    private toastrService = inject(DialogService);


    public readonly items = input<any[]>([]);
    public readonly selected = model(0);
    public readonly header = input($localize `Category`);

    public isEditable = false;
    public readonly add = output();
    public readonly edit = output<any>();
    public readonly remove = output<any>();


    public toggleEdit() {
        this.isEditable = !this.isEditable;
    }

    public tapSelect(item?: any) {
        if (!this.isEditable) {
            this.selected.set( item ? item.id : 0);
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
