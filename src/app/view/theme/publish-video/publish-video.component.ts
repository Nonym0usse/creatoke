import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { CategoryService } from 'src/app/core/services/api/category.service';
import { n8nService } from 'src/app/core/services/api/n8n.service';

type NumMap = Record<string, number>;

@Component({
  selector: 'app-publish-video',
  templateUrl: './publish-video.component.html',
  styleUrls: ['./publish-video.component.scss']
})
export class PublishVideoComponent implements OnInit {
  picturebackground: string = "";
  videoForm: FormGroup;
  platform: string = "";
  progress: NumMap = {};
  isLoading = false;

  constructor(private categoryService: CategoryService, private fb: FormBuilder, private n8nService: n8nService, private title: Title
  ) {
    this.videoForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      video: [null as File | null, Validators.required],
      //platforms: this.fb.array(this.platformOptions.map(() => this.fb.control(false)))
    });
  }

  ngOnInit(): void {
    this.getBackground();
    this.title.setTitle('Créatoke | Publier une vidéo sur les plateformes');
  }

  get platformsFA() {
    return this.videoForm.get('platforms') as FormArray;
  }


  async getBackground() {
    this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
  }


  onFileChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.videoForm.patchValue({ video: file });
    this.videoForm.get('video')?.markAsDirty();
  }

  async validatePublishing() {
    if (this.videoForm.invalid) return;

    this.isLoading = true;

    const { title, description, video } = this.videoForm.value as any;
    const form = new FormData();
    form.append('title', title);
    form.append('description', description);
    form.append('video', video);

    try {
      const res = await this.n8nService.postVideoOnSocialNetwork(form).catch((e) => console.log(e));
      alert(res.status === 200 ? 'Vidéo publiée' : 'Erreur serveur');
    } catch (e) {
      console.error(e);
      alert('Une erreur est survenue lors de la publication');
    } finally {
      this.isLoading = false;
    }
  }
}