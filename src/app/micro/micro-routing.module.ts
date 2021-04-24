import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateViaAuthGuard } from '../theme/guards';
import { AttachmentViewerComponent } from './attachment-viewer/attachment-viewer.component';
import { CommentViewerComponent } from './comment-viewer/comment-viewer.component';
import { DetailComponent } from './detail/detail.component';

import { MicroComponent } from './micro.component';
import { PublishFormComponent } from './publish-form/publish-form.component';
import { ShareComponent } from './share/share.component';

const routes: Routes = [
    { path: 'detail/:id', component: DetailComponent },
    { 
        path: 'share',
        component: ShareComponent,
        canActivate: [CanActivateViaAuthGuard], 
    },
    { path: '', component: MicroComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MicroRoutingModule { }

export const microRoutingComponents = [
    MicroComponent, ShareComponent, PublishFormComponent, DetailComponent, AttachmentViewerComponent, CommentViewerComponent,
];
