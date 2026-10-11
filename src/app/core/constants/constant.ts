//
// Constant variables

export class Constant {

  // Sidebar navbar
  //
  // Start: navbar array
  public static navbar = [
    {
      name: 'Accueil',
      icon: '<i class="ri-home-4-line fs-5"></i>',
      link: '/',
    },
    { head: 'Catalogue' },
    {
      name: 'Chansons à chanter',
      icon: '<i class="ri-mic-line fs-5"></i>',
      link: '/song/chansons-a-chanter',
    },
    {
      name: 'Chanson(s) cherche auteur',
      icon: '<i class="ri-quill-pen-line fs-5"></i>',
      link: '/song/chansons-cherche-auteur',
    },
    {
      name: 'Instrumentaux',
      icon: '<i class="ri-music-2-line fs-5"></i>',
      link: '/song/instrumentaux',
    },
    {
      name: 'Musique de contenus',
      icon: '<i class="ri-film-line fs-5"></i>',
      link: '/song/musique-de-contenus',
    },
    {
      name: 'Créacourcis',
      icon: '<i class="ri-flashlight-line fs-5"></i>',
      link: '/song/creacourcis',
    },
    {
      name: 'Virgules sonores',
      icon: '<i class="ri-sound-module-line fs-5"></i>',
      link: '/song/virgules-sonores',
    },
    { head: 'Créatoké' },
    {
      name: 'Contact',
      icon: '<i class="ri-mail-line fs-5"></i>',
      link: '/contact',
    },
    {
      name: 'Aide',
      icon: '<i class="ri-question-line fs-5"></i>',
      link: '/aide',
    },
  ];

  // Liens légaux : petits liens en pied de barre latérale.
  public static legalLinks = [
    { name: 'À propos', link: '/about' },
    { name: 'Contrats de licence', link: '/contrats-licence' },
    { name: 'Données personnelles', link: '/rgpd' },
  ];

  // Menu d'administration (menu du compte, en haut à droite), regroupé par rubrique.
  public static adminMenu = [
    {
      head: 'Aide',
      items: [
        { name: "Guide d'administration", icon: 'ri-book-open-line', link: '/aide-admin' },
      ],
    },
    {
      head: 'Catalogue',
      items: [
        { name: 'Ajouter une musique', icon: 'ri-add-circle-line', link: '/add-song' },
        { name: 'Chansons', icon: 'ri-disc-line', link: '/manage' },
        { name: 'Licences', icon: 'ri-money-euro-circle-line', link: '/licence' },
      ],
    },
    {
      head: 'Site',
      items: [
        { name: 'Texte d\'accueil', icon: 'ri-text', link: '/text-accueil' },
        { name: 'Image de fond', icon: 'ri-image-2-line', link: '/image-background' },
      ],
    },
    {
      head: 'Relations',
      items: [
        { name: 'Commentaires', icon: 'ri-chat-3-line', link: '/comments' },
        { name: 'Contacts', icon: 'ri-user-search-line', link: '/prospects' },
      ],
    },
    {
      head: 'Outils',
      items: [
        { name: 'Statistiques', icon: 'ri-bar-chart-2-line', link: '/analytics' },
        { name: 'Publier une vidéo', icon: 'ri-video-upload-line', link: '/publish-video' },
      ],
    },
  ];

  // Brand object
  public static BRAND = {
    name: 'Listen app',
    link: '/',
    logo: './assets/images/logos/logo.png',
    email: 'contact@creatoke.com'
  };


  // Objects to view header & footer for landing and app pages.
  public static HEADER_VIEW = {
    landing: 'landing',
    app: 'app'
  };

  public static FOOTER_VIEW = {
    landing: 'landing',
    app: 'app'
  };


  // Invalid form status string.
  public static FORM_INVALID = 'INVALID';

  // Interceptor header string
  public static INTERCEPTOR_SKIP_HEADER = 'X-Skip-Interceptor';


  // Local storage keys
  public static USER_KEY = 'user';
  public static THEME_SKIN = 'skin';
  public static SONG_KEY = 'songs';


  // Attribute names
  public static SIDEBAR_TOGGLE = 'data-sidebar-toggle';
  public static SEARCH_RESULTS = 'data-search-results';
  public static THEME_DARK = 'data-theme';
  public static HEADER = 'data-header';
  public static SIDEBAR = 'data-sidebar';
  public static PLAYER = 'data-player';

  // Enable for theme dark mode
  public static DARK_MODE = true;

  // Components theme :: ['yellow', 'orange', 'red', 'green', 'blue', 'purple', 'indigo', 'dark']
  public static HEADER_THEME = 'indigo';
  public static SIDEBAR_THEME = 'indigo';
  public static PLAYER_THEME = 'indigo';


  // Global HTML classes
  public static ACTIVE = 'active';
  public static SHOW = 'show';
}
