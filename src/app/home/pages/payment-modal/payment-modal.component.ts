// payment-modal.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Pago para Plan {{data.plan}}</h2>
    <mat-dialog-content>
      <form [formGroup]="paymentForm" class="payment-form">
        <mat-form-field appearance="outline">
          <mat-label>Número de tarjeta</mat-label>
          <input matInput formControlName="cardNumber" placeholder="4970 1000 0000 0063">
          <mat-error *ngIf="paymentForm.get('cardNumber')?.hasError('required')">
            Número de tarjeta es requerido
          </mat-error>
          <mat-error *ngIf="paymentForm.get('cardNumber')?.hasError('pattern')">
            Número de tarjeta inválido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Nombre en la tarjeta</mat-label>
          <input matInput formControlName="cardHolderName">
          <mat-error *ngIf="paymentForm.get('cardHolderName')?.hasError('required')">
            Nombre es requerido
          </mat-error>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Fecha de expiración</mat-label>
            <input matInput formControlName="expiryDate" placeholder="MM/YY">
            <mat-error *ngIf="paymentForm.get('expiryDate')?.hasError('required')">
              Fecha de expiración es requerida
            </mat-error>
            <mat-error *ngIf="paymentForm.get('expiryDate')?.hasError('pattern')">
              Formato inválido (MM/YY)
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>CVV</mat-label>
            <input matInput formControlName="cvv" maxlength="3">
            <mat-error *ngIf="paymentForm.get('cvv')?.hasError('required')">
              CVV es requerido
            </mat-error>
            <mat-error *ngIf="paymentForm.get('cvv')?.hasError('pattern')">
              CVV inválido
            </mat-error>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button
        mat-raised-button
        color="primary"
        (click)="onSubmit()"
        [disabled]="!paymentForm.valid">
        Pagar S/.{{data.amount}}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .payment-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 300px;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    mat-form-field {
      width: 100%;
    }
  `]
})
export class PaymentModalComponent {
  paymentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PaymentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { plan: string; amount: number }
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cardHolderName: ['', Validators.required],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      this.dialogRef.close(this.paymentForm.value);
    }
  }
}
