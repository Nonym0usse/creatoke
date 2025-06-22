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

    ngOnInit(): void {
        if (this.songUrlDownload) {
            sessionStorage.setItem('songUrlDownload', this.songUrlDownload);
        } else {
            this.songUrlDownload = sessionStorage.getItem('songUrlDownload') || undefined;
        }
    }

    async downloadFile() {
        if (!this.songUrlDownload) {
            console.error('No song URL available for download');
            return;
        }

        try {
            const response = await fetch(this.songUrlDownload);
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
        }
    }
}