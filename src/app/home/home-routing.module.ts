import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {PlansComponent} from "./pages/plans/plans.component";
import {ServicesComponent} from "./pages/services/services.component";
import {PageNotFoundComponent} from "./pages/page-not-found/page-not-found.component";
import {TickerBookingComponent} from "../ticketbooking/pages/ticker-booking/ticker-booking.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path:'plans', component: PlansComponent },
      {path:'services', component: ServicesComponent },
      { path: '**', component: PageNotFoundComponent }
   ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
