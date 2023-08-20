// Angular
import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CommentService} from "../../../core/services/api/comment.service";


@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html'
})
export class CommentComponent implements OnInit {

  // Holds id from parent
  @Input() id: number | undefined;

  // Holds type for comment like {song, album, artist}
  @Input() data: any | undefined;

  @Input() music: string | undefined;

  comments: any = [];
  // Holds form
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private commentService: CommentService
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.commentService.listComment(this.data.id).then((data) => this.comments = data.data);
  }
  // Inside your component class
  getStarsArray(ratings: number): number[] {
    return Array.from({ length: ratings }, (_, index) => index + 1);
  }


  /**
   * Build comment form
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      ratings: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(40)]),
      name: new FormControl('', [Validators.required, Validators.maxLength(40)]),
      comment: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
      created_at: new FormControl(''),
      music_id: new FormControl('')
    });
  }
  createComment(){
    this.form.patchValue({created_at: this.getCurrentFormattedDate(), music_id: this.data.id})
    this.commentService.createComment(this.form.value).then(() => alert('Commentaire ajouté.'))
  }

   getCurrentFormattedDate() {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }
}
