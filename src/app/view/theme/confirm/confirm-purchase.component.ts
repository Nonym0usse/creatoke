import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-confirm-purchase',
    templateUrl: './confirm-purchase.component.html',
    styleUrls: ['./confirm-purchase.component.scss']
})
export class ConfirmPurchaseComponent implements OnInit {
    songUrlDownload: string | undefined;
    songName: string | undefined;
    downloading = false;
    downloadError = false;

    constructor(private router: Router, private docTitle: Title) {
        const navigation = this.router.getCurrentNavigation();
        this.songUrlDownload = navigation?.extras.state?.['songUrlDownload'];
        this.songName = navigation?.extras.state?.['songName'];
    }

    ngOnInit(): void {
        this.docTitle.setTitle('Confirmation d\'achat | Creatoke');
        // Persistance pour survivre à un rechargement de la page.
        if (this.songUrlDownload) {
            sessionStorage.setItem('songUrlDownload', this.songUrlDownload);
        } else {
            this.songUrlDownload = sessionStorage.getItem('songUrlDownload') || undefined;
        }
        if (this.songName) {
            sessionStorage.setItem('songName', this.songName);
        } else {
            this.songName = sessionStorage.getItem('songName') || undefined;
        }
    }

    async downloadFile() {
        if (!this.songUrlDownload) {
            console.error('No song URL available for download');
            return;
        }

        this.downloading = true;
        this.downloadError = false;
        try {
            const response = await fetch(this.songUrlDownload);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = this.songName || 'downloaded_song.mp3'; // Fallback name
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Cleanup blob URL
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
            this.downloadError = true;
        } finally {
            this.downloading = false;
        }
    }
}
