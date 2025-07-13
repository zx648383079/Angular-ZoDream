import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { shortBackendRoutingComponents, ShortBackendRoutingModule } from './routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { ShortLinkService } from './short-link.service';
import { DialogModule } from '../../../components/dialog';
import { DesktopModule } from '../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DialogModule,
        DesktopModule,
        ShortBackendRoutingModule
    ],
    declarations: [...shortBackendRoutingComponents],
    providers: [
        ShortLinkService
    ]
})
export class ShortLinkBackendModule { }
