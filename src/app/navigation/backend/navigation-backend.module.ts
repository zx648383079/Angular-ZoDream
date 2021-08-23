import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { backendRoutingComponents, BackendRoutingModule } from './backend-routing.module';

@NgModule({
    imports: [
        CommonModule,
        BackendRoutingModule
    ],
    declarations: [...backendRoutingComponents]
})
export class NavigationBackendModule { }
