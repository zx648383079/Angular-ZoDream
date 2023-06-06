import { ISize } from 'selenium-webdriver';
import { IEditorAction, MENU_ACTION } from './action';
import { ICommandManager } from './command';
import { Widget } from './widget';
import { IPoint, IBound } from '../../../../theme/canvas';

export interface IWorkEditor extends ICommandManager {

    getPosition<T extends IPoint>(point: T): T;

    execute(action: IEditorAction| MENU_ACTION): void;

    push(item: Widget, location?: IPoint): boolean;
    remove(item: Widget): void;
    scale(val: number): void;
    resize(val: IBound|ISize): void;
    select(rect: IBound): void;

}