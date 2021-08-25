import { Component, OnInit } from '@angular/core';
import { DialogEvent } from '../../dialog';
import { emptyValidate } from '../../theme/validators';
import { ISite, ISiteCollect, ISiteCollectGroup } from '../model';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-navigation-panel',
  templateUrl: './navigation-panel.component.html',
  styleUrls: ['./navigation-panel.component.scss']
})
export class NavigationPanelComponent {

    public editMode = false;
    public items: ISiteCollectGroup[] = [];
    public editData: ISiteCollect = {} as any;

    constructor(
        private service: NavigationService,
    ) {
        this.service.collectAll().subscribe(res => {
            this.items = res.data;
        });
    }


    public tapAdd(modal: DialogEvent) {
        this.editData = {} as any;
        modal.open(() => {}, () => !emptyValidate(this.editData.name), '新增');
    }
}
