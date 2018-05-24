import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {TitreService} from '../shared/services/titre.service';
import {UtilisateurService} from '../shared/services/utilisateur.service';
import {Utilisateur} from '../shared/domain/Utilisateur';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private titreService: TitreService, private userService: UtilisateurService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.titreService.updateTitre('Connexion');
  }

  connexion(code, psw) {
    if( this.userExist(code.value, psw.value)) {
      this.router.navigate(['/gestionBO']);
    } else {
      this.toastr.error('Identifiant ou mot de passe incorrect');
    }

  }

  private userExist(code: string, psw: string): boolean {
    for ( const user of this.userService.getAll()) {
      if(user.nom.toLowerCase() === code.toLowerCase()) {
        localStorage.setItem('USER', user.ident.toString());
        return true;
      }
    }
    return false;
  }
}
