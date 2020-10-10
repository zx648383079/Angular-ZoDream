import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { SystemService } from '../system.service';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.scss']
})
export class SitemapComponent implements OnInit {

  public items: any[] = [];

  @ViewChild('cmd', {static: false}) box: ElementRef<HTMLDivElement>;

  constructor(
    private renderer2: Renderer2,
    private service: SystemService,) { }

  ngOnInit() {
  }

  /**
   * tapMake
   */
  public tapMake() {
    this.service.sitemap().subscribe(res => {
      this.renderCMD(res.data.map(item => item.url));
    });
  }

  /**
   * renderCMD
   */
  public renderCMD(lines: any[]) {
    let i = 0;
    const handle = setInterval(() => {
            if (i >= lines.length) {
                clearInterval(handle);
                return;
            }
            this.items.push(lines[i++]);
            this.box.nativeElement.scrollTop = this.box.nativeElement.scrollHeight;
        }, Math.max(16, Math.floor(Math.min(lines.length * 100, 10000) / lines.length)));
  }

}
