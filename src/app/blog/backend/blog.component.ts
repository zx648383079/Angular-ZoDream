import { Component, OnInit } from '@angular/core';
import { BlogService } from './blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  public items = [];

  constructor(
    private service: BlogService
  ) { }

  ngOnInit(): void {
    this.service.getSubtotal().subscribe(res => {
      this.items = res;
    });
  }

}
