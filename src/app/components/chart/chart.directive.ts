import { AfterViewInit, Directive, ElementRef, Inject, Input, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CHART_TOKEN, ChartConfigs } from './model';
import { ECharts, EChartsCoreOption, EChartsInitOpts } from 'echarts/core';
import { asyncScheduler, Subject, throttleTime } from 'rxjs';

@Directive({
    standalone: true,
    selector: '[appChart]'
})
export class ChartDirective implements OnInit, OnChanges, AfterViewInit, OnDestroy {


    @Input() public options?: EChartsCoreOption;
    @Input() public initOpts?: EChartsInitOpts;

    private instance: ECharts;
    private resizeOb: ResizeObserver;
    private resize$ = new Subject<void>();

    constructor(
        private zone: NgZone,
        private elementRef: ElementRef<HTMLElement>,
        @Inject(CHART_TOKEN) private configs: ChartConfigs
    ) {

    }
    ngOnInit(): void {
        const element = this.elementRef.nativeElement;
        this.resize$.pipe(throttleTime(100, asyncScheduler, { leading: false, trailing: true }))
            .subscribe(() => this.resize());
        this.resizeOb = this.zone.runOutsideAngular(
        () =>
            new ResizeObserver(entries => {
                for (const entry of entries) {
                    if (entry.target !== element) {
                        continue;
                    }
                    this.resize$.next();
                }
            })
        );
        this.resizeOb.observe(element);

    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.options) {
            this.onOptionsChange(changes.options.currentValue);
        }
    }
    ngAfterViewInit(): void {
        window.setTimeout(() => this.initChart())
    }
    ngOnDestroy(): void {
        this.resize$.unsubscribe();
        this.resizeOb.disconnect();
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
        const dom = this.elementRef.nativeElement;

        if (window && window.getComputedStyle) {
            const prop = window.getComputedStyle(dom, null).getPropertyValue('height');
            if ((!prop || prop === '0px') && (!dom.style.height || dom.style.height === '0px')) {
                dom.style.height = '400px';
            }
        }
        return this.zone.runOutsideAngular(() => {
            const load: () => Promise<any> = typeof this.configs.echarts === 'function' ? this.configs.echarts : () => Promise.resolve(this.configs.echarts);
            return load().then(({ init }) => init(dom, this.configs.theme, this.initOpts));
        });
    }

    private async initChart() {
        await this.onOptionsChange(this.options);
    }

    private async onOptionsChange(opt: any) {
        if (!opt) {
            return;
        }

        if (this.instance) {
            this.setOption(this.options, true);
        } else {
            this.instance = await this.createChart();
            this.setOption(this.options, true);
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
