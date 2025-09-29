import { InjectionToken } from '@angular/core';

export interface ChartConfigs {
  echarts: any | (() => Promise<any>);
  theme?: string | Record<string, any>;
}

export const CHART_TOKEN = new InjectionToken<ChartConfigs>('echarts_configs');