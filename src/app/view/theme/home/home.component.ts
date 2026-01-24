import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeHtml, Title } from "@angular/platform-browser";
import { SongService } from "../../../core/services/api/song.service";
import { CategoryService } from "../../../core/services/api/category.service";
import { Song } from "src/app/core/models/song.model";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit {
  songsHightlighted: Song[] = [];

  safeHtmlContent: SafeHtml | null = null;
  textLoading = true;

  picturebackground: any;

  text = { id: "", text: "" };

  constructor(
    private songService: SongService,
    private categorySerive: CategoryService,
    private sanitizer: DomSanitizer,
    private docTitle: Title
  ) {}

  ngOnInit(): void {
    this.getSongs();
    this.getText();
    this.getBackground();
    this.docTitle.setTitle("Creatoke - Le site de musique pour les artistes");
  }

  getSongs(): void {
    this.songService.highlightedSongs().then((res) => {
      this.songsHightlighted = res.data ?? [];
      console.log(this.songsHightlighted);
    });
  }

  getText(): void {
    this.textLoading = true;
    this.categorySerive.getLastText().then((r) => {
      const item = r.data?.[0];
      this.text = { id: item?.id ?? "", text: item?.text ?? "" };

      this.safeHtmlContent = this.sanitizer.bypassSecurityTrustHtml(this.text.text);
      this.textLoading = false;
    }).catch(() => {
      this.safeHtmlContent = null;
      this.textLoading = false;
    });
  }

  getBackground(): void {
    this.categorySerive.getBackgroundImg().then((r) => {
      this.picturebackground = r.data?.[0]?.picture ?? null;
    });
  }
}