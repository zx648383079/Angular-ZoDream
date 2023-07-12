import { AfterViewInit, Component, ComponentRef, Injector, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { GameService } from './game.service';
import { ThemeService } from '../../theme/services';
import { GameCommand, GameScenePath, IGameCharacter, IGameProject, IGameRouter, IGameScene } from './model';
import { GameSceneItems } from './routing.module';
import { Subject, map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { parseNumber } from '../../theme/utils';
import { GameInjector } from './game.injector';
import { DialogService } from '../../components/dialog';
import { IErrorResponse } from '../../theme/models/page';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, AfterViewInit, IGameRouter {

    @ViewChild('modalVC', {read: ViewContainerRef})
    private modalViewContainer: ViewContainerRef;
    private modalRef: ComponentRef<IGameScene>;
    public project: IGameProject;
    public character: IGameCharacter;
    public params?: any;
    private injector: GameInjector;
    private readyFn: Function;
    private historyItems: string[] = [];

    constructor(
        private service: GameService,
        private router: Router,
        private themeService: ThemeService,
        private toastrService: DialogService,
        injector: Injector,
        private route: ActivatedRoute,
    ) {
        this.themeService.setTitle('Game');
        this.injector = new GameInjector(this, injector);
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.load(parseNumber(params.game));
        });
    }

    ngAfterViewInit(): void {
        if (this.readyFn) {
            setTimeout(() => {
                this.readyFn();
                this.readyFn = undefined;
            }, 1);
        }
    }

    public execute(command: string, data?: any): void {
        
    }

    public request(command: string|any, data?: any): any {
        const queris: any = {
            project: this.project.id,
            character: this.character?.id
        };
        if (typeof command === 'object') {
            queris.batch = command;
        } else {
            queris.command = command;
            queris.data = data;
        }
        return this.service.play(queris).pipe(map((res: any) => {
            if (res.message) {
                this.toastrService.error(res.message);
            }
            if (res.batch) {
                return res.batch;
            }
            return res;
        }));
    }

    public navigate(path: string, data?: any, replace = false): void {
        const scene = GameSceneItems[path];
        if (!scene) {
            console.log(`error path[${path}]`);
            return;
        }
        const last = this.historyItems.length - 1;
        if (this.historyItems.length > 0 && replace) {
            this.historyItems[last] = path;
        } else if (this.historyItems.length < 1 || this.historyItems[last] !== path) {
            this.historyItems.push(path);
        }
        if (this.modalRef) {
            this.modalRef.destroy();
            this.modalRef = undefined;
        }
        this.params = data;
        this.createModal(scene);
    }

    public navigateReplace(path: string, data?: any) {
        this.navigate(path, data, true);
    }

    public navigateBack() {
        if (this.historyItems.length < 2) {
            this.historyItems = [];
            this.navigate(GameScenePath.Mail);
            return;
        }
        const path = this.historyItems[this.historyItems.length - 2];
        this.historyItems.splice(this.historyItems.length - 2, 2);
        if (this.historyItems.length > 20) {
            this.historyItems.splice(0, 14);
        }
        this.navigate(path);
    }

    private createModal(componentType: Type<IGameScene>) {
        if (!this.modalViewContainer) {
            this.readyFn = () => {
                if (!this.modalViewContainer) {
                    return;
                }
                this.createModal(componentType);
            };
            return;
        }
        this.modalRef = this.modalViewContainer.createComponent<IGameScene>(componentType, {
            injector: this.injector
        });
    }

    public toast(msg: IErrorResponse): void;
    public toast(msg: string): void;
    public toast(msg: string|IErrorResponse) {
        if (typeof msg === 'object') {
            this.toastrService.error(msg);
            return;
        }
        this.toastrService.tip(msg);
    }

    public confirm(msg: string): Subject<void> {
        const pipe = new Subject<void>();
        this.toastrService.confirm({
            content: msg,
            onConfirm() {
                pipe.next();
            },
            onCancel() {
                pipe.error(undefined);
            }
        })
        return pipe;
    }

    public exit() {
        if (this.project) {
            window.sessionStorage.removeItem(this.characterToken);
        }
        this.router.navigate(['../../'], {relativeTo: this.route});
    }

    public enter(character: number) {
        window.sessionStorage.setItem(this.characterToken, character.toString());
        this.character = {id: character} as any;
        this.request(GameCommand.Query).subscribe(res => {
            this.project = res.data.project;
            this.themeService.setTitle(this.project.name);
            this.character = res.data.character;
            this.navigate(GameScenePath.Main);
        });
    }

    private get characterToken() {
        return `_gc_${this.project.id}_`;
    }

    private load(project: number) {
        if (project < 1) {
            this.exit();
            return;
        }
        this.project = {id: project} as any;
        const characterId = parseNumber(window.sessionStorage.getItem(this.characterToken));
        if (characterId < 1) {
            this.request(GameCommand.Query).subscribe(res => {
                this.project = res.data.project;
                this.themeService.setTitle(this.project.name);
                this.navigate(GameScenePath.Entry);
            });
            return;
        }
        this.enter(characterId);
    }

}
