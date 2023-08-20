import { Component, OnInit } from '@angular/core';
import {CommentService} from "../../../core/services/api/comment.service";
import {CategoryService} from "../../../core/services/api/category.service";

@Component({
  selector: 'app-comments-admin',
  templateUrl: './comments-admin.component.html',
  styleUrls: ['./comments-admin.component.scss']
})
export class CommentsAdminComponent implements OnInit {

  constructor(private commentService: CommentService, private categoryService: CategoryService) { }
  comms: any = [];
  picturebackground: any;

  ngOnInit(): void {
    this.commentService.getAllComments().then((data) => this.comms = data.data);
    this.getBackground();
  }

  delete(id){
    this.commentService.deleteComment(id).then(() => alert('Commentaire supprimé'))
  }

  // Inside your component class
  getStarsArray(ratings: number): number[] {
    return Array.from({ length: ratings }, (_, index) => index + 1);
  }
  async getBackground() {
    this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
  }
}

