import { Component } from '@angular/core';
import { ToolbarComponent } from "../../components/toolbar/toolbar.component";
import { MatCard, MatCardActions, MatCardContent, MatCardSubtitle, MatCardTitle } from "@angular/material/card";
import { MatFormField } from "@angular/material/form-field";
import { MatButton } from "@angular/material/button";
import { MatInput } from "@angular/material/input";
import { NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { PaymentModalComponent } from "../payment-modal/payment-modal.component";

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [
    ToolbarComponent,
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatCardSubtitle,
    MatCardActions,
    MatFormField,
    MatButton,
    MatInput,
    NgIf,
    FormsModule
  ],
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css']
})
export class PlansComponent {
  subscriptionStatus: string | null = null;

  constructor(public dialog: MatDialog) {}

  subscribe(plan: string) {
    const dialogRef = this.dialog.open(PaymentModalComponent, {
      width: '400px',
      data: { plan: plan }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Subscription data:', result);
        this.subscriptionStatus = `¡Suscripción exitosa al plan ${result.plan}!`;
        // Here you would typically send this data to your backend
      }
    });
  }
}
