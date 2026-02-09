import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PullToRefreshComponent } from './pull-to-refresh/pull-to-refresh.component';
import { TabBarComponent } from './tab-bar/tab-bar.component';
import { RouterModule } from '@angular/router';
import { SwipeControlComponent } from './swipe-control/swipe-control.component';
import { SwipeListControlComponent } from './swipe-control/swipe-list-control.component';
import { SelectPickerComponent } from './select-picker/select-picker.component';

const COMPONENTS = [
    PullToRefreshComponent,
    TabBarComponent,
    SwipeControlComponent,
    SwipeListControlComponent,
    SelectPickerComponent,
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
