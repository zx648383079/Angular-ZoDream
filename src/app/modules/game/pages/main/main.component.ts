import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../../components/dialog';

@Component({
    selector: 'app-game-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    constructor(
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
    }

    public tapCheckin() {
        this.toastrService.success('签到成功');
        this.toastrService.success('获取 牛肉 x1');
        this.toastrService.success('获取 金钱 x1');
    }
}
