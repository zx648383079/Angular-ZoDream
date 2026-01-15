import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { resourceMemberRoutingComponents, ResourceMemberRoutingModule } from './routing.module';
import { ResourceService } from './resource.service';
import { ThemeModule } from '../../../theme/theme.module';
import { DesktopModule } from '../../../components/desktop';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';
import { ZreEditorModule } from '../../../components/editor';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormField } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        FormField,
        DesktopModule,
        DialogModule,
        ZreFormModule,
        ZreEditorModule,
        NgSelectModule,
        ResourceMemberRoutingModule
    ],
    declarations: [...resourceMemberRoutingComponents],
    providers: [
        ResourceService
    ]
})
export class ResourceMemberModule { }
