import { BehaviorSubject } from 'rxjs';

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

export class CommandManager implements ICommandManager {
    public $undoStateChanged: BehaviorSubject<boolean>;
    public $reverseUndoStateChanged: BehaviorSubject<boolean>;
    private undoItems: IBackableCommand[] = [];
    private reverseItems: IBackableCommand[] = [];

    public executeCommand(command: ICommand): void {
        if (!command.execute())
        {
            return;
        }
        this.reverseItems = [];
        if (Object.prototype.hasOwnProperty.call(command, 'undo')) {
            this.undoItems.push(command as IBackableCommand);
        } else {
            this.undoItems = [];
        }
        this.$undoStateChanged.next(this.undoItems.length > 0);
    }
    public undo(): void {
        const command = this.reverseItems.pop();
        if (!command) {
            return;
        }
        command.execute();
        this.undoItems.push(command);
        this.$undoStateChanged.next(this.undoItems.length > 0);
        this.$reverseUndoStateChanged.next(this.reverseItems.length > 0);
    }
    public reverseUndo(): void {
        const command = this.undoItems.pop();
        if (!command) {
            return;
        }
        command.undo();
        this.reverseItems.push(command);
        this.$reverseUndoStateChanged.next(this.reverseItems.length > 0);
    }
}