import { BehaviorSubject } from 'rxjs';
import { Widget } from './widget';
import { ISize, IPoint, IBound } from '../../../../theme/utils/canvas';

export interface ICommand {
    execute(): boolean;
}

export interface IBackableCommand extends ICommand {
    undo(): void;
}

export interface ICommandManager {
    $undoStateChanged: BehaviorSubject<boolean>;
    $reverseUndoStateChanged: BehaviorSubject<boolean>;
    executeCommand(command: ICommand): void;
    undo(): void;
    reverseUndo(): void;
}

function IsBackableCommand(command: ICommand) {
    return !!(command as IBackableCommand).undo;
}

export class CommandManager implements ICommandManager {
    public $undoStateChanged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public $reverseUndoStateChanged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private undoItems: IBackableCommand[] = [];
    private reverseItems: IBackableCommand[] = [];

    public executeCommand(command: ICommand): void {
        if (command.execute() === false)
        {
            return;
        }
        this.reverseItems = [];
        if (IsBackableCommand(command)) {
            this.undoItems.push(command as IBackableCommand);
        } else {
            this.undoItems = [];
        }
        this.$undoStateChanged.next(this.undoItems.length > 0);
    }
    public undo(): void {
        const command = this.undoItems.pop();
        if (!command) {
            return;
        }
        command.undo();
        this.reverseItems.push(command);
        this.$undoStateChanged.next(this.undoItems.length > 0);
        this.$reverseUndoStateChanged.next(this.reverseItems.length > 0);
    }
    public reverseUndo(): void {
        const command = this.reverseItems.pop();
        if (!command) {
            return;
        }
        command.execute();
        this.undoItems.push(command);
        this.$undoStateChanged.next(this.undoItems.length > 0);
        this.$reverseUndoStateChanged.next(this.reverseItems.length > 0);
    }
}

export class BatchCommand implements IBackableCommand {

    constructor(
        ...args: IBackableCommand[]
    ) {
        this.items = args;
    }

    private items: IBackableCommand[];

    undo(): void {
        for (const item of this.items) {
            item.undo();
        }
    }
    execute(): boolean {
        for (const item of this.items) {
            item.execute();
        }
        return true;
    }
}

export class ResizeCommand implements IBackableCommand {

    constructor(
        private target: any,
        private oldValue: ISize,
        private newValue: ISize,
    ) {
    }

    undo(): void {
        this.target.resize(this.oldValue);
    }
    execute(): boolean {
        this.target.resize(this.newValue);
        return true;
    }
}

export class MoveCommand implements IBackableCommand {

    constructor(
        private target: any,
        private oldValue: IPoint,
        private newValue: IPoint,
    ) {
    }

    undo(): void {
        this.target.move(this.oldValue);
    }
    execute(): boolean {
        this.target.move(this.newValue);
        return true;
    }
}

export class ScaleCommand implements IBackableCommand {

    constructor(
        private target: any,
        private oldValue: number,
        private newValue: number,
    ) {
    }

    undo(): void {
        this.target.scale(this.oldValue);
    }
    execute(): boolean {
        this.target.scale(this.newValue);
        return true;
    }
}

export class AddWeightCommand implements IBackableCommand {
    constructor(
        private target: any,
        private weight: Widget,
        private location?: IPoint,
    ) {
    }

    undo(): void {
        this.target.remove(this.weight);
    }
    execute(): boolean {
        return this.target.push(this.weight, this.location);
    }
}

export class RemoveWeightCommand implements IBackableCommand {
    constructor(
        private target: any,
        private weight: Widget,
    ) {
    }

    undo(): void {
        this.target.push(this.weight);
    }
    execute(): boolean {
        this.target.remove(this.weight);
        return true;
    }
}
export class ResizeWidgetCommand implements IBackableCommand {

    constructor(
        private target: Widget|any,
        private oldValue: IBound,
        private newValue: IBound,
    ) {
    }

    undo(): void {
        this.target.bound = this.oldValue;
    }
    execute(): boolean {
        this.target.bound = this.newValue;
        return true;
    }
}

export class ZIndexWidgetCommand implements IBackableCommand {

    constructor(
        private target: Widget|any,
        private oldValue: number,
        private newValue: number,
    ) {
    }

    undo(): void {
        this.target.zindex = this.oldValue;
    }
    execute(): boolean {
        this.target.zindex = this.newValue;
        return true;
    }
}