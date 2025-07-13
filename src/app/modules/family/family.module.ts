import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FamilyComponent } from './family.component';
import { DesktopModule } from '../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        DesktopModule,
    ],
    declarations: [FamilyComponent]
})
export class FamilyModule { }
