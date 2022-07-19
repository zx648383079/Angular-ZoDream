import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { shortBackendRoutingComponents, ShortBackendRoutingModule } from './routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { ShortLinkService } from './short-link.service';
import { DialogModule } from '../../../components/dialog';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DialogModule,
        ShortBackendRoutingModule
    ],
    declarations: [...shortBackendRoutingComponents],
    providers: [
        ShortLinkService
    ]
})
export class ShortLinkBackendModule { }
