import { Component, OnInit } from '@angular/core';
import { ActivationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public mobileOpen: boolean;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(x => x instanceof ActivationStart))
      .subscribe(() => (this.mobileOpen = false));
  }
}
