import { Component, OnInit } from '@angular/core';
import { ColonyService } from './services/colony.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private colonyService: ColonyService) {}

  async ngOnInit() {
    // await this.colonyService.init();
    // const colony = await this.colonyService.createTask();
    //
    // console.log(`Task id ${colony}`);
  }
}
