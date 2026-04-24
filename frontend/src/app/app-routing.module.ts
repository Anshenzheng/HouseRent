import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HouseDetailComponent } from './components/house-detail/house-detail.component';
import { HouseListComponent } from './components/house-list/house-list.component';
import { MyHousesComponent } from './components/my-houses/my-houses.component';
import { HouseFormComponent } from './components/house-form/house-form.component';
import { MyAppointmentsComponent } from './components/my-appointments/my-appointments.component';
import { MyFavoritesComponent } from './components/my-favorites/my-favorites.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'houses', component: HouseListComponent },
  { path: 'houses/:id', component: HouseDetailComponent },
  { 
    path: 'my-houses', 
    component: MyHousesComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'my-houses/new', 
    component: HouseFormComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'my-houses/edit/:id', 
    component: HouseFormComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'my-appointments', 
    component: MyAppointmentsComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'my-favorites', 
    component: MyFavoritesComponent, 
    canActivate: [AuthGuard] 
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
