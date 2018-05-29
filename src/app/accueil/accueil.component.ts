import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {

  constructor(private toastr: ToastrService) { }

  ngOnInit() {
  }

  test(){
    this.toastr.toastrConfig.progressBar = true
    this.toastr.toastrConfig.enableHtml = true
    this.toastr.success("<br /><br /><button type='button' id='confirmationRevertYes' class='btn clear'>Yes</button>",'delete item?')

  }
}
