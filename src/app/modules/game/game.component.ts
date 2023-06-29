import { AfterViewInit, Component, ComponentRef, Injector, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { GameService } from './game.service';
import { ThemeService } from '../../theme/services';
import { GameScenePath, IGameProject, IGameResponse, IGameRouter, IGameScene } from './model';
import { GameSceneItems } from './routing.module';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { parseNumber } from '../../theme/utils';
import { GameInjector } from './game.injector';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, AfterViewInit, IGameRouter {

    @ViewChild('modalVC', {read: ViewContainerRef})
    private modalViewContainer: ViewContainerRef;

    private modalRef: ComponentRef<IGameScene>;
    private project: IGameProject;
    private injector: GameInjector;

    constructor(
        private service: GameService,
        private themeService: ThemeService,
        injector: Injector,
        private route: ActivatedRoute,
    ) {
        this.injector = new GameInjector(this, injector);
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.project = {id: parseNumber(params.game)} as any;
        });
    }

    ngAfterViewInit(): void {
        this.navigate(GameScenePath.Entry)
    }


    public execute(command: string, data?: any): void {
        
    }

    public request(command: string, data?: any): Observable<IGameResponse> {
        return this.service.play({
            project: this.project.id,
            command,
            data
        });
    }

    public navigate(path: string, data?: any): void {
        const scene = GameSceneItems[path];
        if (!scene) {
            return;
        }
        if (this.modalRef) {
            this.modalRef.destroy();
            this.modalRef = undefined;
        }
        this.createModal(scene);
    }

    private createModal(componentType: Type<IGameScene>) {
        this.modalRef = this.modalViewContainer.createComponent<IGameScene>(componentType, {
            injector: this.injector
        });
    }

}
