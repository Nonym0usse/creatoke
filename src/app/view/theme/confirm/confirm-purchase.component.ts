import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SongService } from 'src/app/core/services/api/song.service';

@Component({
    selector: 'app-confirm-purchase',
    templateUrl: './confirm-purchase.component.html',
    styleUrls: ['./confirm-purchase.component.scss']
})
export class ConfirmPurchaseComponent {
    songUrlDownload: string | undefined;
    songName: string | undefined;

    constructor(private router: Router, private songService: SongService) {
        const navigation = this.router.getCurrentNavigation();
        this.songUrlDownload = navigation?.extras.state?.['songUrlDownload'];
        this.songName = navigation?.extras.state?.['songName'];
    }
    ngOnInit() {
        if (this.songUrlDownload) {
            sessionStorage.setItem('songUrlDownload', this.songUrlDownload);
        } else {
            this.songUrlDownload = sessionStorage.getItem('songUrlDownload') || undefined;
        }
    }

    downloadSong() {
        if (this.songUrlDownload) {
            this.songService.downloadSong(this.songName, this.songUrlDownload);
        } else {
            alert('Aucun fichier disponible pour le téléchargement.');
        }
    }
}