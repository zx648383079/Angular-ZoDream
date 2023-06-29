import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { PanelAnimation } from '../../../../../theme/constants';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { IBound, IPoint, computedBound, isIntersect, drawLineTo } from '../../../../../theme/canvas';
import { parseNumber } from '../../../../../theme/utils';
import { emptyValidate } from '../../../../../theme/validators';
import { IGameMap, IGameMapArea } from '../../../model';
import { GameMakerService } from '../../game-maker.service';


const posMap = ['north_id', 'east_id', 'south_id', 'west_id'];

@Component({
    selector: 'app-maker-map-editor',
    templateUrl: './map-editor.component.html',
    styleUrls: ['./map-editor.component.scss'],
    animations: [
        PanelAnimation,
    ]
})
export class MapEditorComponent implements OnInit, AfterViewInit {

    @ViewChild('lineCanvas', {static: true})
    private lineCanvasRef: ElementRef<HTMLCanvasElement>;
    @ViewChild('areaModal')
    private areaModal: DialogEvent;
    @ViewChild('mapModal')
    private mapModal: DialogEvent;
    @ViewChild('monsterModal')
    private monsterModal: DialogEvent;
    public items: IGameMap[] = [];
    public areaItems: IGameMapArea[] = [];
    public panelOpen = false;
    public queries = {
        keywords: '',
        project: 0
    };
    public editData: any = {
        name: ''
    };
    private selectionRect: IBound = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };
    private ctx: CanvasRenderingContext2D;

    private moveListeners = {
        move: undefined,
        finish: undefined,
    };
    private width = 0;
    private height = 0;
    private lineColor = 'lightblue';

    constructor(
        private boxRef: ElementRef<HTMLDivElement>,
        private service: GameMakerService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
    ) { }

    @HostListener('window:resize')
    private onResize() {
        const canvas = this.lineCanvasRef?.nativeElement;
        if (!canvas) {
            return;
        }
        const box = this.boxRef.nativeElement;
        this.width = canvas.width = box.clientWidth;
        this.height = canvas.height = box.clientHeight;
        if (this.ctx) {
            this.refreshLine();
        }
    }
    @HostListener('document:mousemove', ['$event'])
    private onMouseMove(e: MouseEvent) {
        if (this.moveListeners.move) {
            this.moveListeners.move(e);
        }
    }

    @HostListener('document:mouseup', ['$event'])
    private onMouseUp(e: MouseEvent) {
        if (this.moveListeners.finish) {
            this.moveListeners.finish(e);
        }
    }

    ngOnInit() {
        this.route.parent.params.subscribe(params => {
            this.queries.project = parseNumber(params.game);
        });
        this.service.mapAll(this.queries).subscribe(res => {
            this.areaItems = res.area_items;
            this.items = res.items;
            this.refreshLine();
        });
    }

    ngAfterViewInit(): void {
        const canvas = this.lineCanvasRef?.nativeElement;
        if (!canvas) {
            return;
        }
        this.onResize();
        this.ctx = canvas.getContext('2d');
    }
    
    public get selectionStyle() {
        if (!this.selectionRect.width || !this.selectionRect.height) {
            return {
                display: 'none'
            };
        }
        return {
            left: this.selectionRect.x + 'px',
            top: this.selectionRect.y + 'px',
            width: this.selectionRect.width + 'px',
            height: this.selectionRect.height + 'px',
        };
    }

    public tapAddIndigenous(item: IGameMap) {
        this.panelOpen = true;
    }

    public onBoxStart(e: MouseEvent) {
        let isTap = true;
        const start: IPoint = {x: e.clientX, y: e.clientY};
        this.withMove(p => {
            isTap = false;
            this.selectionRect = computedBound(start, {x: p.clientX, y: p.clientY});
        }, () => {
            if (isTap) {
                this.tapAdd(e);
                return;
            }
            const bound = this.formatPoint(this.selectionRect);
            this.items.forEach(i => {
                i.is_selected = isIntersect(bound, i);
            });
            this.selectionRect.width = 0;
        });
    }

    public tapAdd(e: MouseEvent) {
        if (this.items.length > 0) {
            this.items.forEach(i => {
                i.is_selected = false;
            });
            return;
        }
        this.mapModal.open(() => {
            this.service.mapSave({...this.editData, project_id: this.queries.project, ...this.formatPoint(e)}).subscribe(res => {
                this.items.push(res);
            });
        }, () => !emptyValidate(this.editData.name), '添加地图');
    }

    public onMoveStart(item: IGameMap, e: MouseEvent) {
        e.stopPropagation();
        if (!item.is_selected) {
            this.items.forEach(i => {
                i.is_selected = i === item;
            });
        }
        const items = this.items.filter(i => i.is_selected);
        let last: IPoint = {x: e.clientX, y: e.clientY};
        this.withMove(p => {
            const diffX = p.clientX - last.x;
            const diffY = p.clientY - last.y;
            items.forEach(i => {
                i.x += diffX;
                i.y += diffY;
            });
            last = {x: p.clientX, y: p.clientY};
        }, () => {
            this.service.mapBatchSave(this.queries.project, items).subscribe(() => {});
            this.refreshLine();
        });
    }

    public onLinkStart(item: IGameMap, e: MouseEvent, pos = 0) {
        e.stopPropagation();
        const from = this.formatPoint(e);
        const img = this.ctx.getImageData(0, 0, this.width, this.height);
        this.withMove(p => {
            this.ctx.putImageData(img, 0, 0);
            this.lineTo(from, this.formatPoint(p));
        }, p => {
            const target = this.getLineTo(this.formatPoint(p));
            if (target === item) {
                return;
            }
            const toKey = this.posLineToKey(pos);
            if (target) {
                target[toKey] = item.id
                this.service.mapSave({...target, project_id: this.queries.project}).subscribe(res => {
                    const fromKey = this.posToKey(pos);
                    item[fromKey] = res.id;
                    this.items.forEach(i => {
                        if (i !== target && i[toKey] == item.id) {
                            i[toKey] = 0;
                        } else if (i !== item && i[fromKey] == target.id) {
                            i[fromKey] = 0;
                        }
                    });
                    this.refreshLine();
                });
                return;
            }
            
            this.editData = {
                name: '',
                [toKey]: item.id
            };
            this.mapModal.open(() => {
                this.service.mapSave({...this.editData, project_id: this.queries.project, ...this.formatPoint(p)}).subscribe(res => {
                    item[this.posToKey(pos)] = res.id;
                    this.items.forEach(i => {
                        if (i[toKey] == item.id) {
                            i[toKey] = 0;
                        }
                    });
                    this.items.push(res);
                    this.refreshLine();
                });
            }, () => !emptyValidate(this.editData.name), '添加地图');
        });
    }

    private getLineTo(p: IPoint): IGameMap|undefined {
        for (const item of this.items) {
            if (isIntersect(this.formatMapBound(item), p)) {
                return item;
            }
        }
    }

    private lineTo(from: IPoint, to: IPoint) {
        drawLineTo(this.ctx, from, to, 2, this.lineColor);
    }

    private withMove(move?: (p: MouseEvent) => void, finish?: (p: MouseEvent) => void) {
        this.moveListeners = {
            move,
            finish: !move && !finish ? undefined : (p: MouseEvent) => {
                this.moveListeners = {move: undefined, finish: undefined};
                finish && finish(p);
            },
        };
    }

    private formatMapBound(item: IGameMap): IBound {
        return {
            x: item.x,
            y: item.y,
            width: 320,
            height: 48 + 33 * (item.items ? item.items.length + 1 : 1)
        };
    }

    private refreshLine() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        const boundItems: any = {};
        for (const item of this.items) {
            boundItems[item.id] = this.formatMapBound(item);
        }
        const exist = [];
        
        for (const item of this.items) {
            exist.push(item.id);
            posMap.forEach((key, i) => {
                if (!item[key] || exist.indexOf(item[key]) >= 0) {
                    return;
                }
                this.lineTo(this.getPointFromKey(boundItems[item.id], key), this.getPointFromKey(boundItems[item[key]], this.posLineToKey(i)));
            });
        }
    }


    private getPointFromKey(bound: IBound, key: string): IPoint {
        switch (key) {
            case 'east_id':
                return {
                    x: bound.x + bound.width,
                    y: bound.y + bound.height / 2
                };
            case 'south_id':
                return {
                    x: bound.x + bound.width / 2,
                    y: bound.y + bound.height
                };
            case 'west_id':
                return {
                    x: bound.x,
                    y: bound.y + bound.height / 2
                };
            // 'north_id', 
            default:
                return {
                    x: bound.x + bound.width / 2,
                    y: bound.y
                };
        }
    }

    private posToKey(i: number) {
        return posMap[i];
    }

    private posLineToKey(i: number) {
        if (i > 1) {
            return this.posToKey(i - 2);
        }
        return this.posToKey(i + 2);
    }

    private formatPoint<T extends IPoint>(e: T): T;
    private formatPoint(e: MouseEvent): IPoint;
    private formatPoint(e: MouseEvent|IPoint): IPoint {
        if (e instanceof MouseEvent) {
            return {
                x: e.clientX - this.boxRef.nativeElement.offsetLeft,
                y: e.clientY
            };
        }
        return {
            ...e,
            x: e.x - this.boxRef.nativeElement.offsetLeft
        };
    }

}
