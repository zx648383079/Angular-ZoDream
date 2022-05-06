import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogService } from '../../../dialog';
import { CustomDialogComponent } from './custom-dialog/custom-dialog.component';
import { GoodsDialogComponent } from './dialog/goods-dialog.component';

@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.scss']
})
export class GoodsComponent implements OnInit {

    @ViewChild(GoodsDialogComponent)
    private modal: GoodsDialogComponent;

    @ViewChild(CustomDialogComponent)
    private customModal: CustomDialogComponent;

    constructor(
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
    }

    public tapEdit() {
        this.modal.open();
    }

    public tapEditCategory() {
        this.customModal.open();
    }

    public tapRemoveCategory() {
        this.toastrService.confirm('确定删除此分类？', () => {});
    }
}
