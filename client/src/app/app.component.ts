import { Component, OnInit } from '@angular/core';
import { ColonyService } from './services/colony/colony.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private colonyService: ColonyService) {}

  async ngOnInit() {
    await this.colonyService.init();
  }
}
