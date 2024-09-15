// Angular
import { Component, OnInit } from '@angular/core';

// Services
import { SongService } from '../../../core/services/api/song.service';
import { CategoryService } from "../../../core/services/api/category.service";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

    // Holds song data
    songs: any = [];
    safeHtmlContent: SafeHtml | undefined;
    picturebackground: any;
    public text: any = {
        id: "",
        text: ""
    };

    constructor(
        private songService: SongService,
        private categorySerive: CategoryService,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit(): void {
        this.getSongs();
        this.getText();
        this.getBackground();
    }


    /**
     * Get song data from default json.
     */
    getSongs(): void {
        this.songService.highlightedSongs().then((data) => { this.songs = data.data; });
    }

    getText(): void {

        this.categorySerive.getLastText().then(r => this.text = { id: r.data[0]?.id, text: r.data[0]?.text });
        setTimeout(() => {
            this.safeHtmlContent = this.sanitizer.bypassSecurityTrustHtml(this.text.text);
        }, 1000)
    }

    async getBackground() {
        this.categorySerive.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
    }
}
