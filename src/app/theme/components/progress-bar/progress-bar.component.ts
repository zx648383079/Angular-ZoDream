import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements AfterViewInit {

  @ViewChild('progressBox')
  private box: ElementRef;

  @Input() public progress = 0;

  @Output() public progressChange = new EventEmitter();

  constructor() {}

  get progressStyle() {
    return 'width: ' + this.progress + '%;';
  }

  ngAfterViewInit(): void {
    const div = this.box.nativeElement as HTMLDivElement;
    div.addEventListener('click', (event) => {
      const bound = div.getBoundingClientRect();
      this.tapProgress((event.clientX - bound.left) * 100 / bound.width);
    });
  }

  public tapProgress(i: number) {
    i = Math.max(Math.min(i, 100), 0);
    this.progress = i;
    this.progressChange.emit(i);
  }

}
