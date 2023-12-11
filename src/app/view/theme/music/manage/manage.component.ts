import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SongService } from 'src/app/core/services/api/song.service';
import {CategoryService} from "../../../../core/services/api/category.service";

@Component({
    selector: 'app-manage',
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

    songs: any = [];
    picturebackground: any;

  constructor(private musicService: SongService, private router: Router, private categoryService: CategoryService) { }

    ngOnInit(): void {
        this.musicService.getAllSongs().then((music) => this.songs = music.data).catch((err) => console.log(err));
        this.getBackground();
    }

    modify(id: string) {
        this.router.navigate(['/modify-song', id]);
    }

    delete(id: string, name: string) {
      this.musicService.deleteSong(id, name);
      const objectsString = localStorage.getItem('songs'); // Replace 'yourLocalStorageKey' with the key you used to store the array
      // @ts-ignore
      let arrayOfObjects = JSON.parse(objectsString) || [];
      const indexToDelete = arrayOfObjects.findIndex(obj => obj.id === id);
      if (indexToDelete !== -1) {
        arrayOfObjects.splice(indexToDelete, 1);
      }
      localStorage.setItem('songs', JSON.stringify(arrayOfObjects));
    }

    async getBackground() {
      this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
    }
}
