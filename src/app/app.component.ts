import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatIcon, MatIconButton],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
  private isDarkMode = false;

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    console.log(`Tema actual: ${this.isDarkMode ? 'Oscuro' : 'Claro'}`); // Verificar en consola
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  get currentTheme(): boolean {
    return this.isDarkMode;
  }
}
