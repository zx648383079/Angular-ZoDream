import { Component, OnInit, inject, signal } from '@angular/core';
import { GameCommand, GameRouterInjectorToken, IGameRouter, IGameScene } from '../../model';

@Component({
    standalone: false,
    selector: 'app-game-prize',
    templateUrl: './prize.component.html',
    styleUrls: ['./prize.component.scss']
})
export class PrizeComponent implements IGameScene {
    private readonly router = inject<IGameRouter>(GameRouterInjectorToken);


    public readonly items = signal<any[]>([
        {is_open: false},
        {is_open: false}
    ]);
    public modalVisible = false;
    public readonly isLoading = signal(false);
    public lotterying = false;
    public isConfirmed = false;

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
        if (this.isLoading()) {
            return;
        }
        let count = 0;
        for (const item of this.items()) {
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
        if (this.isLoading()) {
            return;
        }
        if (this.isConfirmed) {
            this.router.confirm(msg).subscribe(() => {
                this.isConfirmed = true;
                this.lottery(count, msg);
            });
            return;
        }
        this.isLoading.set(true);
        this.router.request(GameCommand.PrizeOwn).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.items.set(res.data);
            },
            error: err => {
                this.isLoading.set(false);
                this.lotterying = false;
                this.items.set([]);
                this.router.toast(err);
            }
        });
        const items = [];
        for (let i = 0; i < count; i++) {
            items.push({
                is_open: false
            });
        }
        this.items.set(items);
        this.lotterying = true;
    }
}
