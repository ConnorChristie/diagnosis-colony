import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-funding',
  templateUrl: './funding.component.html',
  styleUrls: ['./funding.component.scss']
})
export class FundingComponent implements OnInit {
  public fundingCardDetails = {
    title: 'Fund this Story',
    description:
      'The funds raised for this story will be allocated to the researchers and medical professionals working on solving this mystery.'
  };

  public fundingForm = new FormGroup({
    diagAmount: new FormControl(null, Validators.required),
    currencyAmount: new FormControl({ value: null, disabled: true })
  });

  ngOnInit() {
    this.fundingForm.controls.diagAmount.valueChanges.subscribe(value => {
      this.fundingForm.controls.currencyAmount.setValue(value / 10);
    });
  }

  onSubmitContribution() {
    alert(
      'Thank you for your interest although this feature is not yet implemented...'
    );
  }
}
