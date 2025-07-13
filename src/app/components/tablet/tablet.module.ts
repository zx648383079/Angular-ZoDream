import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PullToRefreshComponent } from './pull-to-refresh/pull-to-refresh.component';
import { TabBarComponent } from './tab-bar/tab-bar.component';
import { RouterModule } from '@angular/router';

const COMPONENTS = [
    PullToRefreshComponent,
    TabBarComponent
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
    ],
    declarations: [...COMPONENTS],
    exports: [...COMPONENTS]
})
export class TabletModule { }
