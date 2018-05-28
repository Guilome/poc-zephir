import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Context} from '../../../shared/domain/context';
import {Nature, Status, Tache} from '../../../shared/domain/Tache';
import {NgForm} from '@angular/forms';
import {TacheService} from '../../../shared/services/tache.service';
import {TitreService} from '../../../shared/services/titre.service';
import { Contrat } from '../../../shared/domain/contrat';
import { ActionMetierService } from '../../../shared/services/action-metier.service';

@Component({
  selector: 'app-edit-tache',
  templateUrl: './edit-tache.component.html',
  styleUrls: ['./edit-tache.component.css']
})
export class EditTacheComponent implements OnInit {

  defaultAction = 'AVENANT';
  defaultPriorite = '0';
  currentDate = new Date();
  currentTache: Tache;

  constructor(private tacheService: TacheService, 
              private router: Router,
              private route: ActivatedRoute,
              private titreService: TitreService, 
              public actionMetier: ActionMetierService) { }

  ngOnInit() {
    this.titreService.updateTitre('Nouvelle Tâche');
    this.route.params.subscribe(params => {
      this.currentTache = this.actionMetier.getById(+params['id']); // (+) converts string 'id' to a number
   });
  }

  onSubmit(form: NgForm) {

    console.log(form.value);

    const numeroContrat = form.value['numeroContrat'];
    const code = form.value['code'];
    const dateLimite = form.value['dateLimite'];
    const priorite = form.value['priorite'];

    const tache = new Tache(Nature.TACHE);
    tache.code = code;
    tache.context = new Context(12, 'ARRAULT ELODIE', 'ESPACE MOLINEL', new Contrat(1,'TEST'));
    tache.status = Status.EN_ATTENTE;
    // tache.libelle = 'Permis de conduire';
    tache.priorite = priorite;
    tache.dateLimite = dateLimite;
    if (localStorage.getItem('idCurrentUser') != null) {
      tache.idUtilisateur = parseInt( localStorage.getItem('idCurrentUser'));
    }

    this.tacheService.addTache(tache);
    this.router.navigate(['/gestionBO']);
  }

}
