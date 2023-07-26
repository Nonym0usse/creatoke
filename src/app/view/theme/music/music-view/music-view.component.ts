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
  public showPaypalButtons: boolean | true;

  // Holds song data
  songs: any = [];

  // Holds router subscription
  routerSubscription: Subscription | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private songService: SongService,
    private playerService: PlayerService,
    private licenceService: LicenceService,
    private paypalService: PaypalService
  ) { }

  ngOnInit(): void {
    this.routerSubscription = this.activatedRoute.params.subscribe(param => {
      this.getSongs(param['detail']);
    });
    this.getLicence();

  }

  pay(price) {
    this.showPaypalButtons = true;
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
                    value: price
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
        console.log(
          "onApprove - transaction was approved, but not authorized",
          data,
          actions
        );
        actions.order.get().then(details => {
          this.paypalService.createSale({ ...this.song, ...this.licences });
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

}
