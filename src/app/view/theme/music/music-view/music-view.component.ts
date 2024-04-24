import {Component, OnInit, ViewChild} from '@angular/core';
import {SongService} from "../../../../core/services/api/song.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PlayerService} from "../../../../core/services/design/player.service";
import {Subscription} from "rxjs";
import {HttpStatus} from "../../../../core/constants/http-status";
import {LicenceService} from "../../../../core/services/api/licence.service";
import {ICreateOrderRequest} from "ngx-paypal";
import {PaypalService} from "../../../../core/services/api/paypal.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DomSanitizer, SafeHtml, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {CategoryService} from "../../../../core/services/api/category.service";

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
  picturebackground: any;
  // Holds song data
  songs: any = [];
  inputForm: FormGroup;
  showLyrics: boolean = false;
  isPlaying: boolean = false;
  audioElement: any;
  trustedDashboardUrl: SafeUrl | undefined;
  // Holds router subscription
  routerSubscription: Subscription | undefined;
  videoUrl: SafeResourceUrl | undefined;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private songService: SongService,
    private playerService: PlayerService,
    private licenceService: LicenceService,
    private paypalService: PaypalService,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private categoryService: CategoryService,
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
    this.getBackground();
  }


  async getBackground() {
    this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
  }

  sanitizeHtml(song) {
    this.trustedDashboardUrl = this.sanitizer.bypassSecurityTrustResourceUrl(song);
  }

  showLyricsBtn(){
    this.showLyrics = !this.showLyrics;
  }


  openModal(price, licence_content, licence_name, title) {
    console.log(licence_content)
    this.display = "block";
    this.payPalConfig = {
      currency: "EUR",
      clientId: "AUmNR3MJCKhVgZvF9z2DByyfihtVVL0M9CB6FERS_LsEAKoTZXt4ctdT30PJIDn3o5x6SYQLe3mGFV_X",
      createOrderOnClient: (data) => < ICreateOrderRequest > {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'EUR',
            value: price.toString(),
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: price.toString()
              }
            }
          },
          items: [{
            name: title,
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'EUR',
              value: price.toString(),
            },
          }]
        }]
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
          licence_name: licence_name,
          licence_type: licence_content,
          current_year: year,
          current_month: month,
          email_client: this.inputForm.get('inputField')?.value,
          titre_chanson: this.song.title,
          image_chanson: this.song.image,
          type_chanson:  licence_name === 'licence-base-plus-creatoke' ? this.song.creatoke_wav + '.wav' :
          licence_name === 'licence-base-creatoke' ? this.song.creatoke_mp3 + '.mp3' :
            licence_name === 'licence-base-chanson' ? this.song.chanson_mp3 + '.mp3' :
                this.song.chanson_wav + '.wav',
          category: this.song.category,
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

  contact(){
    this.router.navigate(['/contact'])
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  downloadSong(songUrl: string) {
    const link = document.createElement('a');
    link.href = songUrl;
    link.target = '_blank'; // Open in a new tab or window
    link.download = 'creatoke-free.mp3'; // Specify the filename here
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    // Delay to allow the browser to initiate the download
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    }, 100);
  }

  /**
   * Get song data from default json.
   * @param id
   */
  getSongs(id: string): void {
    this.songService.getSongByID(id).then(response => {
      this.song = response.data;
      console.log(this.song)
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.song?.youtubeURL}`);
      this.sanitizeHtml(this.song.spotifyURL);
      this.audioElement = new Audio(this.song.creatoke);
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

  toggleAudio() {
    if (this.isPlaying) {
      this.audioElement.pause();
      this.isPlaying = false;
    } else {
      this.audioElement.play();
      this.isPlaying = true;
    }

    this.audioElement.onended = () => {
      this.isPlaying = false;
    };
  }


}
