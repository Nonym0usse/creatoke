import { Component, OnInit, ViewChild } from '@angular/core';
import { SongService } from "../../../../core/services/api/song.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PlayerService } from "../../../../core/services/design/player.service";
import { Subscription } from "rxjs";
import { LicenceService } from "../../../../core/services/api/licence.service";
import { ICreateOrderRequest } from "ngx-paypal";
import { PaypalService } from "../../../../core/services/api/paypal.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { CategoryService } from "../../../../core/services/api/category.service";

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
  showLyrics: boolean = false;
  isPlaying: boolean = false;
  audioElement: any;
  categoryName: string = "";
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
    private sanitizer: DomSanitizer,
    private categoryService: CategoryService,
  ) {
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

  showLyricsBtn() {
    this.showLyrics = !this.showLyrics;
  }

  getParams(sub) {
    switch (sub) {
      case "chansons-a-chanter":
        this.categoryName = " la chanson à chanter";
        break
      case "creacourcis":
        this.categoryName = " le créacourcis";
        break
      case "virgules-sonores":
        this.categoryName = " la virgule sonore";
        break
      case "instrumentaux":
        this.categoryName = " l'instrumental";
        break
      case "musique-de-contenus":
        this.categoryName = " la musique de contenu";
        break
      case "chansons-cherche-auteur":
        this.categoryName = " la chanson cherche auteur";
        break
      default:
        this.categoryName = " la chanson"
        break
    }
    return this.categoryName;
  }

  getCurrentFormattedDate(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Les mois sont basés sur zéro
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  }

  openModal(price, licence_content, licence_name, title) {
    this.display = "block";

    let songUrlDownload = "";
    switch (licence_name) {
      case "price_base":
        songUrlDownload = this.song.chanson_mp3 + '.mp3'
        break;
      case "price_premium":
        songUrlDownload = this.song.chanson_wav + '.wav'
        break;
      case "price_base_creatoke":
        songUrlDownload = this.song.creatoke_mp3 + '.mp3'
        break;
      case "price_premium_creatoke":
        songUrlDownload = this.song.creatoke_wav + '.wav'
        break;
    }

    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    const formatDataForSelling = {
      price: price,
      year: year,
      month: month,
      titre_chanson: this.song.title,
      id_song: this.song.id,
      songUrlDownload: songUrlDownload,
      date: this.getCurrentFormattedDate()
    }

    this.payPalConfig = {
      currency: "EUR",
      clientId: "AUmNR3MJCKhVgZvF9z2DByyfihtVVL0M9CB6FERS_LsEAKoTZXt4ctdT30PJIDn3o5x6SYQLe3mGFV_X",
      createOrderOnClient: (data) => <ICreateOrderRequest>{
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
        actions.order.get().then(details => {
          const payer = details.payer;
          const email = payer.email_address;
          const copyCustomerInfos = { ...formatDataForSelling, email_client: email }

          this.paypalService.createSale(copyCustomerInfos)
            .then((response) => {
              if (response.status === 200) {
                if (response.data?.songUrlDownload) {
                  this.router.navigate(['/confirm-purchase'], { state: { songUrlDownload: response.data.songUrlDownload, songName: this.song.title } });
                } else {
                  console.error('songUrlDownload is undefined!');
                }
              } else {
                alert('Une erreur est survenue lors de l\'approbation de la transaction.');
              }
            })
            .catch((error) => {
              console.error('PayPal Sale Error:', error);
            });
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
        alert("Une erreur s'est produite. Veuillez réessayer votre achat.")
      },
      onClick: (data, actions) => {
        console.log("onClick", data, actions);
      }
    };
  }

  contact() {
    this.router.navigate(['/contact'])
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  downloadSong(songUrl: string) {
    const link = document.createElement('a');
    link.href = songUrl;
    link.target = '_blank';
    link.download = songUrl.split('/').pop() || 'song.mp3'; // Extract the filename from the URL
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
      this.getParams(this.song.category || "");
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.song?.youtubeURL}`);
      this.sanitizeHtml(this.song.spotifyURL);
      this.audioElement = new Audio(this.song.creatoke);
    });
  }

  getLicence() {
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
