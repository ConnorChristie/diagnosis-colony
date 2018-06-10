import { Component, ElementRef, Input, QueryList, Renderer2, ViewChildren } from '@angular/core';

export interface IAuthor {
  name: string;
  image: string;
  link: string;
}

@Component({
  selector: 'app-author-list',
  templateUrl: './author-list.component.html',
  styleUrls: ['./author-list.component.scss']
})
export class AuthorListComponent {
  @Input() public authors;
  @Input() public showDetailed = false;

  @ViewChildren('authorItem') public authorItems: QueryList<ElementRef>;

  private hoverTimeout;
  private readonly className = 'hovered';

  constructor(private renderer: Renderer2) {}

  onMouseEnter(event: MouseEvent) {
    clearTimeout(this.hoverTimeout);

    this.authorItems
      .filter(item => item.nativeElement !== event.target)
      .forEach(item =>
        this.renderer.removeClass(item.nativeElement, this.className)
      );

    this.renderer.addClass(event.target, this.className);
  }

  onMouseLeave(event: MouseEvent) {
    this.hoverTimeout = setTimeout(
      () => this.renderer.removeClass(event.target, this.className),
      800
    );
  }
}
