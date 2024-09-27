import { Routes } from '@angular/router';
import {DestinationComponent} from "./destination/pages/destination/destination.component";
import {AuthGuard} from "./login/auth.guard";
import {PageNotFoundComponent} from "./home/pages/page-not-found/page-not-found.component";
import {HomeComponent} from "./home/pages/home/home.component";
import {PlansComponent} from "./home/pages/plans/plans.component";
import {ServicesComponent} from "./home/pages/services/services.component";
import {TickerBookingComponent} from "./ticketbooking/pages/ticker-booking/ticker-booking.component";
import {RegisterComponent} from "./login/components/register/register.component";
import {RescheduleTripComponent} from "./booking/components/reschedule-trip/reschedule-trip.component";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    canActivate: [AuthGuard],
  },
  { path:'plans', component: PlansComponent },
  {path:'services', component: ServicesComponent },
  {
    path: 'ticketbooking',
    component: TickerBookingComponent,
  },

  {
    path: 'maps',
    loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule),
    canActivate: [AuthGuard], // Protege con el guard
  },
  {
    path: 'list',
    component: DestinationComponent,
    canActivate: [AuthGuard], // Protege con el guard
  },
  {
    path: 'booking',
    loadChildren: () => import('./booking/booking.module').then(m => m.BookingModule),
    canActivate: [AuthGuard], // Protege con el guard
  },
  {
    path: 'reservations',
    loadChildren: () => import('./maps/pages/reservation-cards/reservation-cards.module').then(m => m.ReservationCardsModule),
    canActivate: [AuthGuard], // Protege con el guard
  },
  { path: 'reschedule/:id', component: RescheduleTripComponent },
  {
    path: '**',
    component: PageNotFoundComponent,
  },

];
