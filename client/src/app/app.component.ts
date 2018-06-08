import { Component, OnInit } from '@angular/core';
import { EthersService } from './services/ethers.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private ethersService: EthersService) {}

  async ngOnInit() {
    await this.ethersService.init();
    await this.ethersService.runExample();
  }
}
