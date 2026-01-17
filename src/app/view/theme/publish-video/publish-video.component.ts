import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CategoryService } from 'src/app/core/services/api/category.service';
import { n8nService } from 'src/app/core/services/api/n8n.service';

type UrlMap = Record<string, string>;
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

  //platformOptions = ['Youtube', 'Facebook', 'Bluesky', 'X', 'Instagram', 'LinkedIn'];


  constructor(private categoryService: CategoryService, private fb: FormBuilder, private n8nService: n8nService
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
    //this.setupPlatformDependencies();
  }

  get platformsFA() {
    return this.videoForm.get('platforms') as FormArray;
  }

  /*get selectedPlatforms(): string[] {
    return this.platformOptions.filter((_, i) => this.platformsFA.at(i).value);
  }*/

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

    this.isLoading = true; // 🟢 active le mode chargement

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
      this.isLoading = false; // 🔴 désactive le mode chargement
    }
  }

  /*private setupPlatformDependencies(): void {
    const youtubeIndex = this.indexOf('youtube');
    const instaIndex = this.indexOf('instagram');
    const xIndex = this.indexOf('x');
    const linkedinIndex = this.indexOf('linkedin');

    // sécurise
    const pick = (i: number) => (i > -1 ? this.platformsFA.at(i) as any : null);
    const yCtrl = pick(youtubeIndex);
    const iCtrl = pick(instaIndex);
    const xCtrl = pick(xIndex);
    const lCtrl = pick(linkedinIndex);

    const group = [yCtrl, iCtrl, xCtrl, lCtrl].filter(Boolean) as any[];

    if (!yCtrl || group.length === 0) return;

    const setAll = (val: boolean) => {
      group.forEach(c => c.setValue(!!val, { emitEvent: false }));
    };

    // Quand YouTube change → aligne tout
    yCtrl.valueChanges.subscribe((y: boolean) => setAll(y));

    // Quand un des trois change → aligne tout (donc YouTube aussi)
    [iCtrl, xCtrl, lCtrl].forEach(ctrl => {
      if (!ctrl) return;
      ctrl.valueChanges.subscribe((v: boolean) => setAll(v));
    });

    // Optionnel: normaliser à l'init si besoin
    // setAll(!!yCtrl.value);
  }

  private indexOf(name: string): number {
    return this.platformOptions.findIndex(p => p.toLowerCase() === name);
  }*/
}