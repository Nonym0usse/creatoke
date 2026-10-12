import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SongService } from 'src/app/core/services/api/song.service';
import {CategoryService} from "../../../../core/services/api/category.service";
import { Title } from '@angular/platform-browser';
import { NotifyService } from 'src/app/core/services/global/notify.service';

@Component({
    selector: 'app-manage',
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

    songs: any = [];
    picturebackground: any;

  constructor(private musicService: SongService, private router: Router, private categoryService: CategoryService, private title: Title,
    private notify: NotifyService) { }

    ngOnInit(): void {
        this.musicService.getAllSongs().then((music) => this.songs = music.data).catch((err) => console.error(err));
        this.getBackground();
        this.title.setTitle('Créatoke | Gérer mes musiques');
    }

    modify(id: string) {
        this.router.navigate(['/modify-song', id]);
    }

    async delete(id: string, name: string) {
      const ok = await this.notify.confirm({
        title: `Supprimer « ${name} » ?`,
        message: 'La chanson disparaîtra du site. Cette action est définitive.',
        confirmLabel: 'Supprimer',
        danger: true,
      });
      if (!ok) return;
      try {
        await this.musicService.deleteSong(id);
      } catch {
        this.notify.error(`« ${name} » n'a pas pu être supprimée. Réessayez dans un instant.`);
        return;
      }
      this.notify.success(`« ${name} » a été supprimée.`);
      // Retire la ligne du tableau sans attendre un rechargement.
      this.songs = this.songs.filter((song: any) => song.id !== id);
      const objectsString = localStorage.getItem('songs');
      const arrayOfObjects: any[] = JSON.parse(objectsString || '[]') || [];
      const indexToDelete = arrayOfObjects.findIndex((obj) => obj.id === id);
      if (indexToDelete !== -1) {
        arrayOfObjects.splice(indexToDelete, 1);
      }
      localStorage.setItem('songs', JSON.stringify(arrayOfObjects));
    }

    async getBackground() {
      this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
    }
}
