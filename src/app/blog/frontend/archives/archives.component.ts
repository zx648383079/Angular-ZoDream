import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
import { IArchives } from '../../../theme/models/blog';

@Component({
  selector: 'app-archives',
  templateUrl: './archives.component.html',
  styleUrls: ['./archives.component.scss']
})
export class ArchivesComponent implements OnInit {

  public items: IArchives[] = [];

  public title = '归档';

  constructor(
    private service: BlogService
  ) {
    this.service.getArchives().subscribe(res => {
      this.items = res;
    });
  }

  ngOnInit() {
  }

}
