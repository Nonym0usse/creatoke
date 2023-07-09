import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SongService } from 'src/app/core/services/api/song.service';

@Component({
    selector: 'app-manage',
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

    songs: any = [];
    constructor(private musicService: SongService, private router: Router) { }

    ngOnInit(): void {
        //this.musicService.getAllSongs().then((music) => this.songs = music).catch((err) => console.log(err));
    }

    modify(id: string) {
        this.router.navigate(['/modify-song', id]);
    }

    delete(id: string) {
        this.musicService.deleteSong(id);
    }
}
