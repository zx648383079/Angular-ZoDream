import { Component, OnInit } from '@angular/core';
import { NoteService } from './note.service';

@Component({
  selector: 'app-note-backend',
  templateUrl: './note-backend.component.html',
  styleUrls: ['./note-backend.component.scss']
})
export class NoteBackendComponent implements OnInit {

    public isLoading = true;
    public data: any = {};

    constructor(
        private service: NoteService,
    ) { }

    ngOnInit() {
        this.service.statistics().subscribe(res => {
            this.isLoading = false;
            this.data = res;
        });
    }

}
