import { Component, OnInit } from '@angular/core';
import {SongService} from "../../../../core/services/api/song.service";
import {ActivatedRoute} from "@angular/router";
import {PlayerService} from "../../../../core/services/design/player.service";
import {Subscription} from "rxjs";
import {HttpStatus} from "../../../../core/constants/http-status";
import {PlanService} from "../../../../core/services/api/plan.service";
import {LicenceService} from "../../../../core/services/api/licence.service";
import {ICreateOrderRequest} from "ngx-paypal";
import {PaypalService} from "../../../../core/services/api/paypal.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-music-view',
  templateUrl: './music-view.component.html',
  styleUrls: ['./music-view.component.scss']
})
export class MusicViewComponent implements OnInit {

  // Holds song data
  song: any;
  licences: any = [];
  public payPalConfig: any;
  //@ts-ignore
  display = "none";
  // Holds song data
  songs: any = [];
  inputForm: FormGroup;
  showLyrics: boolean = false;

  // Holds router subscription
  routerSubscription: Subscription | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private songService: SongService,
    private playerService: PlayerService,
    private licenceService: LicenceService,
    private paypalService: PaypalService,
    private formBuilder: FormBuilder
  ) {
    this.inputForm = this.formBuilder.group({
      // Define your input form controls here
      // Example:
      inputField: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.routerSubscription = this.activatedRoute.params.subscribe(param => {
      this.getSongs(param['detail']);
    });
    this.getLicence();

  }

  showLyricsBtn(){
    this.showLyrics = !this.showLyrics;
  }


  openModal(price, licence_type) {
    this.display = "block";
    this.payPalConfig = {
      currency: "EUR",
      clientId: "AUmNR3MJCKhVgZvF9z2DByyfihtVVL0M9CB6FERS_LsEAKoTZXt4ctdT30PJIDn3o5x6SYQLe3mGFV_X",
      createOrder: data =>
        <ICreateOrderRequest>{
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "EUR",
                value: price,
                breakdown: {
                  item_total: {
                    currency_code: "EUR",
                    value: price.toString()
                  }
                }
              },
            }
          ]
        },
      advanced: {
        commit: "true"
      },
      style: {
        label: "paypal",
        layout: "vertical"
      },
      onApprove: (data, actions) => {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = now.getFullYear();
        const customData = {
          price: price,
          licence_type: licence_type === 'premium' ? this.licences[0].premium : licence_type === "regular" ? this.licences[0].regular : this.licences[0].basic,
          current_year: year,
          current_month: month,
          email_client: this.inputForm.get('inputField')?.value,
          titre_chanson: this.song.title,
          image_chanson: this.song.image,
          type_chanson: this.song.category == "chansons" ? this.song.full_creatoke : this.song.full_music,
          id_song: this.song.id
        }
        actions.order.get().then(details => {
          this.paypalService.createSale(customData).then(() => alert("Merci pour votre achat. Vérifiez votre boite mail."));
        });
      },
      onClientAuthorization: data => {
        console.log(
          "onClientAuthorization - you should probably inform your server about completed transaction at this point",
          data
        );
      },
      onCancel: (data, actions) => {
        console.log("OnCancel", data, actions);
      },
      onError: err => {
        console.log("OnError", err);
      },
      onClick: (data, actions) => {
        console.log("onClick", data, actions);
      }
    };
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  /**
   * Get song data from default json.
   * @param id
   */
  getSongs(id: string): void {
    this.songService.getSongByID(id).then(response => {
      this.song = response.data;
    });
  }

  getLicence(){
    this.licenceService.listLicence().then((data) => this.licences = data.data);
  }

  /**
   * Play song
   * @param event
   */
  play(event: any): void {
    this.playerService.songPlayPause(event, this.song);
  }

  onCloseHandled() {
    this.display = "none";
  }

}
