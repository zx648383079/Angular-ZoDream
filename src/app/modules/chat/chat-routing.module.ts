import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatComponent } from './chat.component';
import { ProfileDialogComponent } from './profile/profile-dialog.component';
import { RenameDialogComponent } from './rename/rename-dialog.component';
import { SearchDialogComponent } from './search/search-dialog.component';
import { SelectDialogComponent } from './select/select-dialog.component';
import { ApplyDialogComponent } from './apply/apply-dialog.component';

const routes: Routes = [{ path: '', component: ChatComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }


export const contactRoutedComponents = [
    ChatComponent, 
    ProfileDialogComponent, RenameDialogComponent, SearchDialogComponent, SelectDialogComponent, ApplyDialogComponent
];
