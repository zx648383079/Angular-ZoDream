import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { resourceStoreRoutedComponents, ResourceStoreRoutingModule } from './resource-routing.module';

@NgModule({
    imports: [
        CommonModule,
        ResourceStoreRoutingModule
    ],
    declarations: [...resourceStoreRoutedComponents]
})
export class ResourceStoreModule { }
