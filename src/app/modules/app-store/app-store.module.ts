import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { appStoreRoutedComponents, AppStoreRoutingModule } from './app-routing.module';

@NgModule({
    imports: [
        CommonModule,
        AppStoreRoutingModule,
    ],
    declarations: [...appStoreRoutedComponents]
})
export class AppStoreModule { }
