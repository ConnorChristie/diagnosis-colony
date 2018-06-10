import { Component, ElementRef, QueryList, Renderer2, ViewChildren } from '@angular/core';

interface IAuthor {
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
  public authors: IAuthor[] = [
    {
      name: "Dr. O'Nolan",
      image:
        '//www.gravatar.com/avatar/f95828f4e92f1befebabfb7f65cdc8f2?s=250&amp;d=mm&amp;r=x',
      link: '/'
    },
    {
      name: 'Hannah Wolfe',
      image:
        'https://www.gravatar.com/avatar/49ebcbbe9bb3ed1f5d5de91483de383c?s=250&d=mm&r=x',
      link: '/'
    }
  ];

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
