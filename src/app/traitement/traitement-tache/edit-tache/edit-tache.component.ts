import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Context} from '../../../shared/domain/context';
import {Nature, Status, Tache} from '../../../shared/domain/Tache';
import {NgForm} from '@angular/forms';
import {TacheService} from '../../../shared/services/tache.service';

@Component({
  selector: 'app-edit-tache',
  templateUrl: './edit-tache.component.html',
  styleUrls: ['./edit-tache.component.css']
})
export class EditTacheComponent implements OnInit {

  defaultAction = 'AVENANT';
  defaultPriorite = '0';

  constructor(private tacheService: TacheService, private router: Router) {
  }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {

    console.log(form.value);

    const numeroContrat = form.value['numeroContrat'];
    const code = form.value['code'];
    const dateLimite = form.value['dateLimite'];
    const priorite = form.value['priorite'];

    const tache = new Tache(Nature.TACHE, code);
    tache.context = new Context(12, numeroContrat, 'ARRAULT ELODIE', 'ESPACE MOLINEL');
    tache.status = Status.EN_ATTENTE;
    // tache.libelle = 'Permis de conduire';
    tache.priorite = priorite;
    tache.dateLimite = dateLimite;

    this.tacheService.addTache(tache);
    this.router.navigate(['/gestionBO']);
  }

}
