import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuComponent } from './context-menu.component';
import { MenuBodyComponent } from './menu-body/menu-body.component';

const COMPONENTS = [
    ContextMenuComponent,
    MenuBodyComponent,
];

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [...COMPONENTS],
    exports: [
        ...COMPONENTS,
    ]
})
export class ContextMenuModule { }
