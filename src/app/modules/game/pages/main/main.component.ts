import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { IGameScene } from '../../model';

@Component({
    selector: 'app-game-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements IGameScene {

    constructor(
        private toastrService: DialogService,
    ) { }

    public tapCheckin() {
        this.toastrService.success('签到成功');
        this.toastrService.success('获取 牛肉 x1');
        this.toastrService.success('获取 金钱 x1');
    }
}
