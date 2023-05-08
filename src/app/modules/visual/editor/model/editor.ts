import { ISize } from 'selenium-webdriver';
import { IEditorAction, MENU_ACTION } from './action';
import { ICommandManager } from './command';
import { IBound, IPoint } from './core';
import { Widget } from './widget';

export interface IWorkEditor extends ICommandManager {

    getPosition<T extends IPoint>(point: T): T;

    execute(action: IEditorAction| MENU_ACTION): void;

    push(item: Widget, location?: IPoint): boolean;
    remove(item: Widget): void;
    scale(val: number): void;
    resize(val: IBound|ISize): void;
    select(rect: IBound): void;

}