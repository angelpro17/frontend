import {Component, OnInit} from '@angular/core';
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatFormField} from "@angular/material/form-field";
import {ServiceDestination} from "../../../destination/services/interfaces/destinationApi";
import {ActivatedRoute, Router} from "@angular/router";
import {DestinationApiService} from "../../../destination/services/destination-api.service";
import {MatDivider} from "@angular/material/divider";
import {MatCard} from "@angular/material/card";
import {FormsModule} from "@angular/forms";
import {CommonModule, DecimalPipe, NgForOf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import { Location } from '@angular/common';
import {ToolbarComponent} from "../../../home/components/toolbar/toolbar.component";
import {ReservaService} from "../../../maps/pages/reservation-cards/service/reserva.service";

@Component({
  selector: 'app-book-trip',
  standalone: true,
  imports: [
    MatButtonToggleGroup,
    MatButtonToggle,
    MatFormField,
    MatDivider,
    MatCard,
    FormsModule,
    NgForOf,
    MatButton,
    MatInput,
    DecimalPipe,
    CommonModule,
    ToolbarComponent
  ],
  templateUrl: './book-trip.component.html',
  styleUrl: './book-trip.component.css'
})
export class BookTripComponent implements OnInit{
  destinationId!: number;
  destination!: ServiceDestination;

  selectedDate!: number;
  selectedTime!: string;

  // Variables para el descuento y total
  discountCode: string = '';
  total: number = 20;
  discountApplied: boolean = false;  // Para saber si el descuento ya ha sido aplicado

  // Días generados dinámicamente
  days: { date: number, dayName: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private destinationService: DestinationApiService,
    private location: Location,
    private reservaService: ReservaService
  ) { }

  ngOnInit(): void {
    // Obtener el ID del destino de la URL
    this.destinationId = +this.route.snapshot.paramMap.get('id')!;

    // Llamar al servicio para obtener los detalles del destino
    this.destinationService.getDestinationById(this.destinationId).subscribe((data: ServiceDestination) => {
      this.destination = data;
    });
    //Mostrar el generador de días
    this.generateDays();
  }

  // Generar dinámicamente los días con sus nombres
  generateDays(): void {
    const today = new Date();
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      const dayName = dayNames[date.getDay()];
      this.days.push({ date: date.getDate(), dayName: dayName });
    }
  }

  // Metodo para aplicar el descuento
  applyDiscount(): void {
    // Comprobar si el código de descuento ingresado coincide con el discountCode del conductor
    if (this.discountCode.toLowerCase() === this.destination.driver.discountCode.toLowerCase()) {
      if (!this.discountApplied) {
        // Aplicar el descuento basado en el valor del conductor
        const discountValue = parseFloat(this.destination.driver.discount) / 100;
        this.total = this.total - (this.total * discountValue);
        this.discountApplied = true;
        alert(`Descuento del ${this.destination.driver.discount} aplicado.`);
      } else {
        alert('El descuento ya ha sido aplicado.');
      }
    } else {
      alert('Código de descuento no válido.');
    }
  }

  //Metodo para confirmar la reserva
  confirmReservation(): void {
    console.log('Botón de confirmar viaje presionado');  // Agrega este log para depurar

    if (!this.selectedDate || !this.selectedTime) {
      alert("Por favor, selecciona una fecha y una hora para continuar.");
      return;
    }

    const newReservation = {
      usuario: this.destination.driver.name,
      ubicacion: this.destination.location,
      hora: this.selectedTime,
      estado: 'Confirmado',
      fecha: `${this.selectedDate}/09/2024`,
      driver: this.destination.driver,  // Asegúrate de guardar los datos del conductor
      destinationId: this.destinationId// Formatea la fecha según tu preferencia
    };

    //Codigo de prueba
    // Agregar la nueva reserva usando el servicio
    this.reservaService.addReserva(newReservation).subscribe(() => {
      alert(`Reserva confirmada para ${this.destination.name} el día ${this.selectedDate} a las ${this.selectedTime}`);
      this.router.navigate(['/reservations']);  // Redirigir a la página de reservas
    }, error => {
      console.error('Error al confirmar la reserva', error);
    });
  }

  // Método para regresar a la página anterior
  goBack(): void {
    this.location.back();
  }
}
