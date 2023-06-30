import { Component, Inject, OnInit } from '@angular/core';
import { GameRouterInjectorToken, IGameRouter, IGameScene } from '../../model';

@Component({
    selector: 'app-game-prize',
    templateUrl: './prize.component.html',
    styleUrls: ['./prize.component.scss']
})
export class PrizeComponent implements IGameScene {

    public items: any[] = [
        {is_open: false},
        {is_open: false}
    ];
    public modalVisible = false;
    public isLoading = false;
    public lotterying = false;
    public isConfirmed = false;

    constructor(
        @Inject(GameRouterInjectorToken) private router: IGameRouter,
    ) { }

    public tapBack() {
        this.router.navigateBack();
    }

    public tapOne() {
        this.lottery(1, '确定进行单抽抽奖？');
    }

    public tapTen() {
        this.lottery(10, '确定进行十连抽奖？');
    }

    public tapJump() {
        let count = 0;
        for (const item of this.items) {
            if (!item.is_open) {
                count ++;
            }
            item.is_open = true;
        }
        if (count > 0) {
            return;
        }
        this.lotterying = false;
    }

    private lottery(count: number, msg: string) {
        if (this.isConfirmed) {
            this.router.confirm(msg).subscribe(() => {
                this.isConfirmed = true;
                this.lottery(count, msg);
            });
            return;
        }
        this.items = [];
        for (let i = 0; i < count; i++) {
            this.items.push({
                is_open: false
            });
        }
        this.lotterying = true;
    }
}
