import { DestroyRef, Directive, ElementRef, NgZone, OnDestroy, afterNextRender, afterRenderEffect, inject, input } from '@angular/core';
import { CHART_TOKEN, ChartConfigs } from './model';
import { ECharts, EChartsCoreOption, EChartsInitOpts } from 'echarts/core';
import { asyncScheduler, Subject, throttleTime } from 'rxjs';

@Directive({
    standalone: true,
    selector: '[appChart]'
})
export class ChartDirective {
    private readonly zone = inject(NgZone);
    private readonly destroyRef = inject(DestroyRef);
    private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    private readonly configs = inject<ChartConfigs>(CHART_TOKEN);



    public readonly options = input<EChartsCoreOption>();
    public readonly initOpts = input<EChartsInitOpts>();

    private booted = false;
    private instance: ECharts;

    constructor() {
        const element = this.elementRef.nativeElement;
        const resize$ = new Subject<void>();
        resize$.pipe(
            throttleTime(100, asyncScheduler, { leading: false, trailing: true }),
            takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => this.resize());
        const resizeOb = this.zone.runOutsideAngular(
        () =>
            new ResizeObserver(entries => {
                for (const entry of entries) {
                    if (entry.target !== element) {
                        continue;
                    }
                    resize$.next();
                }
            })
        );
        resizeOb.observe(element);
        afterNextRender({
            write: () => this.initChart()
        });
        afterRenderEffect(() => this.onOptionsChange(this.options()));
        this.destroyRef.onDestroy(() => resizeOb.disconnect())
    }

    private resize() {
        if (this.instance) {
            this.instance.resize();
        }
    }

    // private async refreshChart() {
    //     this.dispose();
    //     await this.initChart();
    // }

    private createChart() {
        if (this.booted) {
            return;
        }
        this.booted = true;
        const dom = this.elementRef.nativeElement;
        if (window && window.getComputedStyle) {
            const prop = window.getComputedStyle(dom, null).getPropertyValue('height');
            if ((!prop || prop === '0px') && (!dom.style.height || dom.style.height === '0px')) {
                dom.style.height = '400px';
            }
        }
        return this.zone.runOutsideAngular(() => {
            const load: () => Promise<any> = typeof this.configs.echarts === 'function' ? this.configs.echarts : () => Promise.resolve(this.configs.echarts);
            return load().then(({ init }) => init(dom, this.configs.theme, this.initOpts()));
        });
    }

    private async initChart() {
        await this.onOptionsChange(this.options());
    }

    private async onOptionsChange(opt: any) {
        if (!opt) {
            return;
        }

        if (this.instance) {
            this.setOption(this.options(), true);
        } else {
            this.instance = await this.createChart();
            this.setOption(this.options(), true);
        }
    }
    private setOption(option: any, opts?: any) {
        if (this.instance) {
            try {
                this.instance.setOption(option, opts);
            } catch (e) {
                console.error(e);
            }
        }
    }

    private dispose() {
        if (this.instance) {
            if (!this.instance.isDisposed()) {
                this.instance.dispose();
            }
            this.instance = null;
        }
    }
}
function takeUntilDestroyed(destroyRef: DestroyRef): import("rxjs").OperatorFunction<void, unknown> {
    throw new Error('Function not implemented.');
}

