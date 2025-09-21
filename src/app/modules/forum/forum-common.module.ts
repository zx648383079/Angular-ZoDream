import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostBlockComponent } from './components';
import { MediaPlayerModule } from '../../components/media-player';
import { DesktopModule } from '../../components/desktop';

const COMPONENTS = [
    PostBlockComponent
];

@NgModule({
    imports: [
        CommonModule,
        DesktopModule,
        MediaPlayerModule,
    ],
    declarations: [	
        ...COMPONENTS
   ],
    exports: [
        ... COMPONENTS
    ]
})
export class ForumCommonModule { }
