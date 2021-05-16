import { BehaviorSubject, Subject } from 'rxjs';
import { IActionItem } from './core';

export class ActionHistory {

    /** 
     * 当前操作记录
     */
    private actionItems: IActionItem[] = [];
    /**
     * 当前所处的位置
     */
    private actionIndex = -1;

    public readonly action$ = new Subject<any>();

    /**
     * 是否能取消撤销操作
     */
     public canForward(): boolean {
        return this.actionIndex >= 0 && this.actionIndex < this.actionItems.length  - 1;
    }

    /**
     * 是否能撤销操作
     */
    public canBack(): boolean {
        return this.actionIndex >= 0;
    }

    public goForward() {
    }

    public goBack() {
        
    }
}