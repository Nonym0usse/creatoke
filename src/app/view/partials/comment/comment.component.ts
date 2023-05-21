// Angular
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html'
})
export class CommentComponent implements OnInit {

  // Holds id from parent
  @Input() id: number | undefined;

  // Holds type for comment like {song, album, artist}
  @Input() type: string | undefined;

  // Holds form
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
  }

  /**
   * Build comment form
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      ratings: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl(''),
      comment: new FormControl('')
    });
  }

}
