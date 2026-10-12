// Éléments communs aux pages « Ajouter une chanson » et « Modifier une chanson ».
// Les styles partagés sont dans song-form.scss.

export interface CategoryChoice {
  value: string;
  label: string;
  icon: string;
  hint: string;
}

export interface MediaBlock {
  key: string;
  group: 'chanson' | 'creatoke';
  label: string;
  hint: string;
  format: string;
  accept: string;
  hideWhenCategoryIn?: string[];
  hideWhenExclu?: boolean;
}

export interface Offer {
  show: string;
  price: string;
  file: string;
  label: string;
  fileLabel: string;
}

// Taille maximale d'un fichier envoyé (limite du serveur).
export const MAX_UPLOAD_MB = 500;

// Catégories sans créatoké (ni fichiers, ni prix créatoké).
export const NO_CREATOKE = ['instrumentaux', 'musique-de-contenus', 'virgules-sonores'];

// Catégories sans paroles.
export const NO_LYRICS = ['instrumentaux', 'musique-de-contenus'];

export const CATEGORIES: CategoryChoice[] = [
  { value: 'chansons-a-chanter', label: 'Chansons à chanter', icon: 'ri-mic-line', hint: 'Une chanson originale, avec sa version créatoké pour chanter dessus.' },
  { value: 'chansons-cherche-auteur', label: 'Chanson(s) cherche auteur', icon: 'ri-quill-pen-line', hint: 'Une chanson qui attend son auteur.' },
  { value: 'instrumentaux', label: 'Instrumentaux', icon: 'ri-music-2-line', hint: 'Une musique sans chant.' },
  { value: 'musique-de-contenus', label: 'Musique de contenus', icon: 'ri-film-line', hint: 'Une musique pour des vidéos, podcasts…' },
  { value: 'creacourcis', label: 'Créacourcis', icon: 'ri-flashlight-line', hint: 'Un format court.' },
  { value: 'virgules-sonores', label: 'Virgules sonores', icon: 'ri-sound-module-line', hint: 'Un très court jingle.' },
];

// Fichiers audio, regroupés en « La chanson » et « Le créatoké ».
export const MEDIA_BLOCKS: MediaBlock[] = [
  { key: 'url', group: 'chanson', label: 'Pour l\'écouter sur le site', hint: 'C\'est ce que les visiteurs entendent quand ils cliquent sur « Écouter ».', format: 'MP3', accept: '.mp3,audio/mpeg', hideWhenExclu: true },
  { key: 'chanson_mp3', group: 'chanson', label: 'Fichier vendu — licence de base', hint: 'Le client le reçoit quand il achète la licence de base.', format: 'MP3', accept: '.mp3,audio/mpeg', hideWhenExclu: true },
  { key: 'chanson_wav', group: 'chanson', label: 'Fichier vendu — licence premium', hint: 'Le client le reçoit quand il achète la licence premium (meilleure qualité).', format: 'WAV', accept: '.wav,audio/wav,audio/x-wav' },
  { key: 'creatoke', group: 'creatoke', label: 'Pour l\'écouter sur le site', hint: 'La version sans la voix principale, que les visiteurs peuvent écouter.', format: 'MP3', accept: '.mp3,audio/mpeg', hideWhenCategoryIn: NO_CREATOKE },
  { key: 'creatoke_mp3', group: 'creatoke', label: 'Fichier vendu — licence de base', hint: 'Le client le reçoit quand il achète la licence de base du créatoké.', format: 'MP3', accept: '.mp3,audio/mpeg', hideWhenCategoryIn: NO_CREATOKE },
  { key: 'creatoke_wav', group: 'creatoke', label: 'Fichier vendu — licence premium', hint: 'Le client le reçoit quand il achète la licence premium du créatoké.', format: 'WAV', accept: '.wav,audio/wav,audio/x-wav', hideWhenCategoryIn: NO_CREATOKE },
];

export const SONG_OFFERS: Offer[] = [
  { show: 'isLicenceBase', price: 'price_base', file: 'chanson_mp3', label: 'Licence de base', fileLabel: 'le fichier MP3 de la chanson' },
  { show: 'isPremium', price: 'price_premium', file: 'chanson_wav', label: 'Licence premium', fileLabel: 'le fichier WAV de la chanson' },
];

export const CREATOKE_OFFERS: Offer[] = [
  { show: 'isLicenceBaseCreatoke', price: 'price_base_creatoke', file: 'creatoke_mp3', label: 'Licence de base', fileLabel: 'le fichier MP3 du créatoké' },
  { show: 'isPremiumCreatoke', price: 'price_premium_creatoke', file: 'creatoke_wav', label: 'Licence premium', fileLabel: 'le fichier WAV du créatoké' },
];

/** Le bloc de fichier s'affiche-t-il pour cette catégorie / exclusivité ? */
export function blockVisible(block: MediaBlock, category: string, exclu: boolean): boolean {
  if (block.hideWhenExclu && exclu) return false;
  return !block.hideWhenCategoryIn?.includes(category);
}

// ---- Liens : on accepte le lien tel que copié, on garde le format attendu ----

/** « https://www.youtube.com/watch?v=Aq1NJxJZo6E » → « Aq1NJxJZo6E ». */
export function youtubeId(input: string): string {
  const v = (input ?? '').trim();
  const m = v.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
  return m ? m[1] : v;
}

/** Lien de partage ou code d'intégration Spotify → lien d'intégration. */
export function spotifyEmbed(input: string): string {
  let v = (input ?? '').trim();
  const src = v.match(/src="([^"]+)"/);
  if (src) v = src[1];
  const m = v.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(?:embed\/)?(track|album|playlist|episode|artist)\/([A-Za-z0-9]+)/);
  return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}` : v;
}

/** Identifiant YouTube valide (11 caractères), ou chaîne vide. */
export function youtubePreview(input: string): string {
  const id = youtubeId(input);
  return /^[\w-]{11}$/.test(id) ? id : '';
}

export function spotifyOk(input: string): boolean {
  return spotifyEmbed(input).startsWith('https://open.spotify.com/embed/');
}

/** Nom lisible d'un fichier envoyé (/uploads/songs/<horodatage>_<id>_<nom>). */
export function fileNameFromUrl(url?: string): string {
  const s = (url ?? '').trim();
  if (!s || s === 'vide') return '';
  try {
    const name = decodeURIComponent(new URL(s).pathname.split('/').pop() || '');
    return name.replace(/^\d{13}_[0-9a-f]{16}_/, '');
  } catch {
    return '';
  }
}
