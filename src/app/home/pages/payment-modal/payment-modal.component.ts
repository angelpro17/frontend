import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import {MatDialog, MatDialogContent, MatDialogModule, MatDialogTitle} from "@angular/material/dialog";
import {MatProgressSpinner, MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {Router} from "@angular/router";
import {ToolbarComponent} from "../../components/toolbar/toolbar.component";

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    ToolbarComponent
  ],
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.css']
})
export class PaymentModalComponent implements OnInit {
  paymentForm: FormGroup;
  paypalForm: FormGroup;
  paymentMethod: FormControl;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.paymentMethod = new FormControl('card');

    this.paymentForm = this.formBuilder.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^(\d{4}\s){3}\d{4}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/), this.validateExpiryDate]],
      cvc: ['', [Validators.required, Validators.pattern(/^[0-9]{3}$/)]]
    });

    this.paypalForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.paymentMethod.valueChanges.subscribe(method => {
      if (method === 'paypal') {
        this.paymentForm.disable();
      } else {
        this.paymentForm.enable();
      }
    });
  }

  formatCardNumber(event: any) {
    let input = event.target;
    let trimmed = input.value.replace(/\s+/g, '');
    if (trimmed.length > 16) {
      trimmed = trimmed.substr(0, 16);
    }
    let numbers = [];
    for (let i = 0; i < trimmed.length; i += 4) {
      numbers.push(trimmed.substr(i, 4));
    }
    input.value = numbers.join(' ');
    this.paymentForm.get('cardNumber')?.setValue(input.value);
  }

  formatExpiryDate(event: any) {
    let input = event.target;
    let trimmed = input.value.replace(/[^\d]/g, '');
    if (trimmed.length > 4) {
      trimmed = trimmed.substr(0, 4);
    }
    if (trimmed.length > 2) {
      input.value = trimmed.substr(0, 2) + '/' + trimmed.substr(2);
    } else {
      input.value = trimmed;
    }
    this.paymentForm.get('expiryDate')?.setValue(input.value);
  }

  validateExpiryDate(control: FormControl) {
    if (control.value) {
      const [month, year] = control.value.split('/');
      const currentYear = new Date().getFullYear() % 100;
      if (parseInt(year) <= currentYear) {
        return { invalidDate: true };
      }
    }
    return null;
  }

  isFormValid(): boolean {
    return this.paymentForm.valid && !this.isLoading;
  }

  onSubmit() {
    if (this.isFormValid()) {
      this.isLoading = true;
      const dialogRef = this.dialog.open(LoadingDialogComponent, {
        disableClose: true
      });

      // Simulate payment processing
      setTimeout(() => {
        dialogRef.componentInstance.setSuccess();

        // Redirect to home after 2 seconds
        setTimeout(() => {
          this.isLoading = false;
          dialogRef.close();
          this.router.navigate(['/home']);
        }, 2000);
      }, 3000);
    }
  }

  onPaypalSubmit() {
    if (this.paypalForm.valid) {
      // Redirect to PayPal login page
      window.location.href = 'https://www.paypal.com/signin';
    }
  }
}

@Component({
  selector: 'app-loading-dialog',
  template: `
    <h2 mat-dialog-title>{{ title }}</h2>
    <mat-dialog-content>
      <div class="loading-content">
        <mat-spinner *ngIf="!success" diameter="50"></mat-spinner>
        <mat-icon *ngIf="success" class="success-icon">check_circle</mat-icon>
        <p>{{ message }}</p>
      </div>
    </mat-dialog-content>
  `,
  styles: [`
    .loading-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    p {
      margin-top: 20px;
    }
    .success-icon {
      font-size: 50px;
      height: 50px;
      width: 50px;
      color: #4caf50;
    }
  `],
  standalone: true,
  imports: [MatDialogModule, MatProgressSpinnerModule, MatIconModule, CommonModule]
})
export class LoadingDialogComponent {
  title = 'Procesando pago';
  message = 'Por favor espere...';
  success = false;

  setSuccess() {
    this.success = true;
    this.title = 'Pago Exitoso';
    this.message = 'Transacción realizada correctamente';
  }
}
