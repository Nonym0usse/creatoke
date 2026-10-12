import { Component, OnInit } from '@angular/core';
import {CommentService} from "../../../core/services/api/comment.service";
import {CategoryService} from "../../../core/services/api/category.service";
import { Title } from '@angular/platform-browser';
import { NotifyService } from "../../../core/services/global/notify.service";

@Component({
  selector: 'app-comments-admin',
  templateUrl: './comments-admin.component.html',
  styleUrls: ['./comments-admin.component.scss']
})
export class CommentsAdminComponent implements OnInit {

  constructor(private commentService: CommentService, private categoryService: CategoryService, private title: Title,
    private notify: NotifyService) { }
  comms: any = [];
  picturebackground: any;

  ngOnInit(): void {
    this.commentService.getAllComments().then((data) => this.comms = data.data);
    this.getBackground();
    this.title.setTitle('Créatoke | Gestion des commentaires');
  }

  async delete(id){
    const ok = await this.notify.confirm({
      title: 'Supprimer ce commentaire ?',
      message: 'Il disparaîtra du site. Cette action est définitive.',
      confirmLabel: 'Supprimer',
      danger: true,
    });
    if (!ok) return;
    this.commentService.deleteComment(id)
      .then(() => {
        this.comms = this.comms.filter((comment: any) => comment.id !== id);
        this.notify.success('Le commentaire a été supprimé.');
      })
      .catch(() => this.notify.error('Le commentaire n\'a pas pu être supprimé. Réessayez dans un instant.'));
  }

  // Inside your component class
  getStarsArray(ratings: number): number[] {
    return Array.from({ length: ratings }, (_, index) => index + 1);
  }
  async getBackground() {
    this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
  }
}

