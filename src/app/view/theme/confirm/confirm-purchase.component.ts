import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-confirm-purchase',
    templateUrl: './confirm-purchase.component.html',
    styleUrls: ['./confirm-purchase.component.scss']
})
export class ConfirmPurchaseComponent {
    songUrlDownload: string | undefined;
    songName: string | undefined;

    constructor(private router: Router) {
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
            fetch(this.songUrlDownload)
                .then(response => response.blob())
                .then(blob => {
                    const blobUrl = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.setAttribute('download', this.songName || 'song.mp3');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(blobUrl); // Cleanup
                })
                .catch(error => {
                    console.error('Download error:', error);
                    alert('Erreur lors du téléchargement du fichier.');
                });
        } else {
            alert('Aucun fichier disponible pour le téléchargement.');
        }
    }
}