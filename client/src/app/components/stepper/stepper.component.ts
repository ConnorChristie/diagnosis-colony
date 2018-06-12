import { Component, Input, OnInit } from '@angular/core';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle as faCheckCircleSolid } from '@fortawesome/free-solid-svg-icons';

export interface IStep {
  name: string;
  link: string[];
  isActive: boolean;
}

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {
  public faCheckCircle = faCheckCircle;
  public faCheckCircleSolid = faCheckCircleSolid;

  @Input() public steps: IStep[];

  constructor() {}

  ngOnInit() {}
}
