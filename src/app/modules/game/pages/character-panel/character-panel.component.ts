import { Component, OnInit } from '@angular/core';
import { IGameScene } from '../../model';

@Component({
  selector: 'app-character-panel',
  templateUrl: './character-panel.component.html',
  styleUrls: ['./character-panel.component.scss']
})
export class CharacterPanelComponent implements IGameScene {

  constructor() { }

  public tapBack() {

  }

}
