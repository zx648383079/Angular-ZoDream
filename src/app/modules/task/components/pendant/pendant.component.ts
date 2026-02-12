import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { KeepAliveService } from '../../../../theme/services/keep-alive.service';
import { ITask } from '../../model';
import { filter, interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    standalone: false,
    selector: 'app-plan-pendant',
    templateUrl: './pendant.component.html',
    styleUrls: ['./pendant.component.scss'],
    host: {
        '[class.--with-open]': 'isActive()'
    }
})
export class PlanPendantComponent {

    private readonly liveService = inject(KeepAliveService);
    private readonly destroyRef = inject(DestroyRef);
    
    public readonly visible = signal(false);
    public readonly isActive = signal(true);
    public readonly isPaused = signal(true);
    public readonly value = signal(0);
    public readonly max = signal(0);
    public readonly current = signal<ITask>(null);
    private startTime = 0;

    public readonly progressStyle = computed(() => {
        const value = this.value();
        const max = this.max();
        return {
            '--zre-percent': max > 0 ? value * 100 / max : 1
        };
    });

    constructor() {
        interval(100)
        .pipe(
            takeUntilDestroyed(this.destroyRef),
            filter(() => !this.isPaused())
        )
        .subscribe(() => {
            this.value.set(Math.ceil((Date.now() - this.startTime) / 1000));
        });
        this.visible.set(true);
    }


    public toggle() {
        if (this.isPaused()) {
            this.start(this.value(), (this.current()?.every_time || 0) * 60);
        } else {
            this.stop();
        }
    }

    public start(value = 0, max = 0) {
        this.value.set(value);
        this.max.set(max);
        this.startTime = Date.now() - value * 1000;
        this.isPaused.set(false);
    }

    public stop() {
        this.isPaused.set(true);
    }
}
