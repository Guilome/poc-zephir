import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  connexion(code, psw) {
    localStorage.setItem('idCurrentUser', '1');
    this.router.navigate(['/gestionBO']);
  }
}
