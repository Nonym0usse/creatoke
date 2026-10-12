// Angular
import { Component, forwardRef, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// CKEditor 5 n'est chargé (JS et CSS) qu'à l'affichage d'un éditeur, donc
// jamais pour les visiteurs : seules les pages d'administration en ont.
const STYLESHEET = 'assets/vendors/ckeditor5/ckeditor5.css';

export type RichEditorPreset = 'simple' | 'complet';

const TOOLBARS: Record<RichEditorPreset, string[]> = {
  simple: ['bold', 'italic', 'underline', '|', 'bulletedList', 'numberedList', '|', 'undo', 'redo'],
  complet: ['heading', '|', 'bold', 'italic', 'underline', 'link', '|', 'bulletedList', 'numberedList', 'blockQuote',
    '|', 'undo', 'redo'],
};

let loading: Promise<{ Editor: unknown; plugins: unknown[]; translations: unknown }> | null = null;

function loadCkeditor() {
  if (!document.querySelector(`link[href="${STYLESHEET}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = STYLESHEET;
    document.head.appendChild(link);
  }
  loading ??= import('./ckeditor-bundle').then((ck) => ({
    Editor: ck.ClassicEditor,
    plugins: [ck.Essentials, ck.Paragraph, ck.Heading, ck.Bold, ck.Italic, ck.Underline, ck.Link, ck.List,
      ck.BlockQuote, ck.Autoformat, ck.PasteFromOffice],
    translations: ck.fr,
  }));
  return loading;
}

/**
 * Éditeur de texte riche commun au site (CKEditor 5).
 *   <app-rich-editor formControlName="lyrics" preset="simple"></app-rich-editor>
 */
@Component({
  selector: 'app-rich-editor',
  templateUrl: './rich-editor.component.html',
  styleUrls: ['./rich-editor.component.scss'],
  // Les styles doivent atteindre le DOM créé par CKEditor.
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RichEditorComponent), multi: true }],
})
export class RichEditorComponent implements OnInit, ControlValueAccessor {
  @Input() preset: RichEditorPreset = 'simple';
  @Input() placeholder = '';
  /** Hauteur minimale de la zone de saisie, en pixels. */
  @Input() minHeight = 180;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Editor: any = null;
  config: Record<string, unknown> = {};
  value = '';
  disabled = false;
  failed = false;

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  ngOnInit(): void {
    loadCkeditor()
      .then(({ Editor, plugins, translations }) => {
        this.config = {
          licenseKey: 'GPL',
          language: 'fr',
          translations: [translations],
          plugins,
          toolbar: { items: TOOLBARS[this.preset], shouldNotGroupWhenFull: false },
          heading: {
            options: [
              { model: 'paragraph', title: 'Paragraphe', class: 'ck-heading_paragraph' },
              { model: 'heading3', view: 'h3', title: 'Titre', class: 'ck-heading_heading3' },
              { model: 'heading4', view: 'h4', title: 'Sous-titre', class: 'ck-heading_heading4' },
            ],
          },
          link: { addTargetToExternalLinks: true, defaultProtocol: 'https://' },
          placeholder: this.placeholder,
        };
        this.Editor = Editor;
      })
      .catch((error) => {
        console.error('CKEditor loading error:', error);
        this.failed = true;
      });
  }

  onInput(value: string): void {
    this.value = value ?? '';
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  // ---- ControlValueAccessor ----
  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }
}
