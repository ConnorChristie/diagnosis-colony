import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

import { NewStoryService } from '../../../services/new-story/new-story.service';

@Component({
  selector: 'app-researchers',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss']
})
export class PublishComponent {
  constructor(
    private newStoryService: NewStoryService,
    private router: Router
  ) {}

  onPublish() {
    this.newStoryService
      .saveStory()
      .pipe(tap(() => this.newStoryService.clearAllDetails().subscribe()))
      .subscribe(async id => {
        await this.router.navigate(['/stories', id]);
      });
  }
}
