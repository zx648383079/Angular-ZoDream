import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  public content: SafeHtml;

  constructor(
    private sanitizer: DomSanitizer
  ) {
    this.content = this.sanitizer.bypassSecurityTrustHtml('1231');
  }

  ngOnInit() {
  }

}
