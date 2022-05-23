import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuaComponent } from './gua/gua.component';
import { TurntableComponent } from './turntable/turntable.component';
import { LatticeComponent } from './lattice/lattice.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [GuaComponent, TurntableComponent, LatticeComponent],
    exports: [GuaComponent, TurntableComponent, LatticeComponent]
})
export class GameModule { }
