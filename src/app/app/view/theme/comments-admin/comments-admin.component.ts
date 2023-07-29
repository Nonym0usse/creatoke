import { Component, OnInit } from '@angular/core';
import {CommentService} from "../../../../core/services/api/comment.service";

@Component({
  selector: 'app-comments-admin',
  templateUrl: './comments-admin.component.html',
  styleUrls: ['./comments-admin.component.scss']
})
export class CommentsAdminComponent implements OnInit {

  constructor(private commentService: CommentService) { }
  comms: any = [];
  ngOnInit(): void {
    this.commentService.getAllComments().then((data) => this.comms = data.data);
  }

  delete(id){
    this.commentService.deleteComment(id).then(() => alert('Commentaire supprimé'))
  }

  // Inside your component class
  getStarsArray(ratings: number): number[] {
    return Array.from({ length: ratings }, (_, index) => index + 1);
  }

}

