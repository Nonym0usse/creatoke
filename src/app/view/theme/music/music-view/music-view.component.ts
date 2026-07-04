import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { SongService } from "../../../../core/services/api/song.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PlayerService } from "../../../../core/services/design/player.service";
import { Subject, Subscription } from "rxjs";
import { LicenceService } from "../../../../core/services/api/licence.service";
import { ICreateOrderRequest } from "ngx-paypal";
import { PaypalService } from "../../../../core/services/api/paypal.service";
import { DomSanitizer, SafeResourceUrl, SafeUrl, Title } from '@angular/platform-browser';
import { CategoryService } from "../../../../core/services/api/category.service";
import { Song } from 'src/app/core/models/song.model';

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (opts: { url: string }) => void };
  }
}

@Component({
  selector: 'app-music-view',
  templateUrl: './music-view.component.html',
  styleUrls: ['./music-view.component.scss']
})

export class MusicViewComponent implements OnInit, OnDestroy, OnChanges {

  // Holds song data
  song: Song = {} as Song;
  licences: any = [];
  public payPalConfig: any;
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
  imgLoading = true;
  isModalOpen = false;
  copied = false;
  pageLoading = true;
  loadError = false;
  // Paiement validé côté PayPal, création de la vente en cours :
  // on l'affiche à l'acheteur et on bloque la fermeture de la modale.
  paymentProcessing = false;
  categoryLabel = '';

  private readonly CATEGORY_LABELS: Record<string, string> = {
    'chansons-a-chanter': 'Chansons à chanter',
    'creacourcis': 'Créacourcis',
    'virgules-sonores': 'Virgules sonores',
    'instrumentaux': 'Instrumentaux',
    'musique-de-contenus': 'Musique de contenus',
    'chansons-cherche-auteur': 'Chanson(s) cherche auteur',
  };
  private destroy$ = new Subject<void>();
  private promoTriggeredForUrl = new Set<string>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private songService: SongService,
    private playerService: PlayerService,
    private licenceService: LicenceService,
    private paypalService: PaypalService,
    private sanitizer: DomSanitizer,
    private categoryService: CategoryService,
    private title: Title
  ) {
  }

  ngOnInit(): void {
    this.routerSubscription = this.activatedRoute.paramMap.subscribe(pm => {
      const slug = pm.get("slug") || "";
      this.getSongs(slug);
    });
    // 1er chargement
    this.getLicence();
    this.getBackground();
  }


  private checkPromoteAndOpenCalendly(title?: string) {
    const promote = this.activatedRoute.snapshot.queryParamMap.get("promote") === "1";
    if (!promote) return;

    const songTitle = (title ?? this.song?.title ?? "").trim();
    if (!songTitle) return;

    const pathOnly = this.router.url.split("?")[0];
    const key = `${pathOnly}::promote`;
    if (this.promoTriggeredForUrl.has(key)) return;
    this.promoTriggeredForUrl.add(key);

    setTimeout(() => {
      const base = "https://calendly.com/jeanarnaque13/creatoke";
      const url =
        `${base}` +
        `?a1=${encodeURIComponent(songTitle)}` +
        `&utm_source=creatoke&utm_campaign=promote`;

      window.Calendly?.initPopupWidget({ url });

      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: { promote: null },
        queryParamsHandling: "merge",
        replaceUrl: true,
      });
    }, 0);
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

  openPaypalModal(price, licence_name, title) {
    this.isModalOpen = true;

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
      licence_name: licence_name,
      songUrlDownload: songUrlDownload,
      date: this.getCurrentFormattedDate()
    }

    this.payPalConfig = {
      currency: "EUR",
      clientId: "AUmNR3MJCKhVgZvF9z2DByyfihtVVL0M9CB6FERS_LsEAKoTZXt4ctdT30PJIDn3o5x6SYQLe3mGFV_X",
      createOrderOnClient: (_data) => <ICreateOrderRequest>{
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
        this.paymentProcessing = true;
        actions.order.get().then(details => {
          const payer = details.payer;
          const email = payer.email_address;
          const nomClient = [payer.name?.given_name, payer.name?.surname].filter(Boolean).join(' ');
          const copyCustomerInfos = { ...formatDataForSelling, email_client: email, nom_client: nomClient }

          this.paypalService.createSale(copyCustomerInfos)
            .then((response) => {
              if (response.status === 200 && response.data?.songUrlDownload) {
                this.router.navigate(['/confirm-purchase'], { state: { songUrlDownload: response.data.songUrlDownload, songName: this.song.title } });
              } else {
                console.error('songUrlDownload is undefined!');
                alert('Votre paiement a bien été reçu, mais un problème technique est survenu lors de la préparation de votre téléchargement. Contactez-nous à contact@creatoke.fr en indiquant votre email PayPal : nous vous enverrons votre musique au plus vite.');
              }
            })
            .catch((error) => {
              console.error('PayPal Sale Error:', error);
              alert('Votre paiement a bien été reçu, mais un problème technique est survenu lors de la préparation de votre téléchargement. Contactez-nous à contact@creatoke.fr en indiquant votre email PayPal : nous vous enverrons votre musique au plus vite.');
            })
            .finally(() => {
              this.paymentProcessing = false;
            });
        });
      },
      onClientAuthorization: () => {
        // Transaction approuvée côté client : le serveur est notifié via le flux PayPal ci-dessus.
      },
      onCancel: () => {
        // Achat annulé par l'utilisateur.
      },
      onError: () => {
        alert("Une erreur s'est produite. Veuillez réessayer votre achat.")
        window.location.reload();
      },
      onClick: () => {
        // Clic sur le bouton PayPal.
      }
    };
  }

  closePaypalModal() {
    // Ne pas fermer pendant la finalisation : l'acheteur a déjà payé.
    if (this.paymentProcessing) return;
    this.isModalOpen = false;
  }

  contact() {
    this.router.navigate(['/contact'])
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
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
   * @param slug
   */
  getSongs(slug: string): void {
    this.pageLoading = true;
    this.loadError = false;
    this.songService.getSongBySlug(slug).then(response => {
      this.song = response.data;
      if (!this.song || Object.keys(this.song).length === 0) {
        this.loadError = true;
        return;
      }
      this.getParams(this.song.category || "");
      this.categoryLabel = this.CATEGORY_LABELS[this.song.category || ''] ?? (this.song.category || '');
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.song?.youtubeURL}`);
      this.sanitizeHtml(this.song.spotifyURL);
      this.audioElement = new Audio(this.song?.creatoke ?? "");
      this.checkPromoteAndOpenCalendly(this.song.title || "");
      this.title.setTitle(`Créatoke | ${this.song.title || ''}`);
    }).catch((error) => {
      console.error('getSongBySlug error:', error);
      this.loadError = true;
    }).finally(() => {
      this.pageLoading = false;
    });
  }

  getLicence() {
    this.licenceService.listLicence().then((data) => this.licences = data.data);
  }

  copySongUrl(): void {
    const url = `${window.location.origin}${this.router.url}`;
    const promoteUrl = url.includes("?") ? `${url}&promote=1` : `${url}?promote=1`;

    // API moderne
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(promoteUrl)
        .then(() => this.onCopySuccess())
        .catch(() => this.fallbackCopy(promoteUrl));
    } else {
      this.fallbackCopy(promoteUrl);
    }
  }

  private fallbackCopy(text: string) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    this.onCopySuccess();
  }

  private onCopySuccess() {
    this.copied = true;
    setTimeout(() => this.copied = false, 2000);
  }

  /**
   * Play song
   * @param event
   */
  play(event: any): void {
    this.playerService.songPlayPause(event, this.song);
  }

  ngOnChanges() {
    // si song change et qu'on charge une nouvelle image => on remet le loader
    this.imgLoading = true;
  }

  toggleAudio() {
    if (this.isPlaying) {
      this.audioElement.pause();
      this.isPlaying = false;
    } else {
      this.audioElement.play().catch(() => this.isPlaying = false);
      this.isPlaying = true;
    }

    this.audioElement.onended = () => {
      this.isPlaying = false;
    };
  }


}
