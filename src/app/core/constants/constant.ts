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
      link: '/home',
      auth: false,
    },
    {
      name: 'Chansons à chanter',
      icon: '<i class="ri-disc-line fs-5"></i>',
      link: '/song/chansons-a-chanter',
      auth: false,
    },
    {
      name: 'Instrumentaux',
      icon: '<i class="ri-music-2-line fs-5"></i>',
      link: '/song/instrumentaux',
      auth: false,
    },
    {
      name: 'Chanson(s) cherche auteur',
      icon: '<i class="ri-disc-line fs-5"></i>',
      link: '/song/chansons-cherche-auteur',
      auth: false,
    },
    {
      name: 'Musique de contenus',
      icon: '<i class="ri-youtube-line fs-5"></i>',
      link: '/song/musique-de-contenus',
      auth: false,
    },
    {
      name: 'Raccourcis',
      icon: '<i class="ri-star-line fs-5"></i>',
      link: '/song/raccourcis',
      auth: false,
    },
    {
      name: 'Contact',
      icon: '<i class="ri-mail-send-line fs-5"></i>',
      link: '/contact',
      auth: false,
    },
    {
      head: 'Tableau de bord',
      auth: true,

    },
    {
      name: 'Statistiques',
      icon: '<i class="ri-pie-chart-line fs-5"></i>',
      link: '/analytics',
      auth: true,
    },
    {
      name: 'Catégories',
      icon: '<i class="ri-stack-fill fs-5"></i>',
      link: '/category',
      auth: true,
    },
    {
      name: 'Chansons',
      icon: '<i class="ri-edit-2-fill fs-5"></i>',
      link: '/manage',
      auth: true,
    },
    {
      name: 'Licences',
      icon: '<i class="ri-money-euro-circle-line fs-5"></i>',
      link: '/licence',
      auth: true,
    },
    {
      name: 'Commentaires',
      icon: '<i class="ri-user-line fs-5"></i>',
      link: '/comments',
      auth: true,
    },
    {
      name: 'Texte accueil',
      icon: '<i class="ri-edit-2-fill fs-5"></i>',
      link: '/text-accueil',
      auth: true,
    },
    {
      name: 'Image de fond',
      icon: '<i class="ri-image-2-fill fs-5"></i>',
      link: '/image-background',
      auth: true,
    },
  ];

  public static AUTH_ERROR_MESSAGES_FR = {
    'auth/invalid-email': 'Adresse e-mail invalide.',
    'auth/user-disabled': 'L\'utilisateur est désactivé.',
    'auth/user-not-found': 'L\'utilisateur n\'existe pas.',
    'auth/wrong-password': 'Adresse e-mail ou mot de passe invalides.'
  };

  // End: navbar array


  // Top header menu
  //
  // Start: header menu array
  public static menu = [
    {
      name: 'Discover',
      link: '/app'
    },
    {
      name: 'Pricing',
      link: '/landing',
      fragment: 'pricing'
    },
    {
      name: 'About us',
      link: '/about'
    },
    {
      name: 'Blog',
      link: '/blog'
    },
    {
      name: 'Contact us',
      link: '/contact'
    }
  ];
  // End: header array


  // Login user dropdown options
  //
  // Start: options array
  public static options = [
    {
      name: 'Profile',
      icon: '<i class="ri-user-3-line fs-5"></i>',
      link: '/app/profile'
    },
    {
      name: 'Favorites',
      icon: '<i class="ri-heart-line fs-5"></i>',
      link: '/app/favorites'
    },
    {
      name: 'Settings',
      icon: '<i class="ri-settings-line fs-5"></i>',
      link: '/app/settings'
    },
    {
      name: 'Plan',
      icon: '<i class="ri-money-dollar-circle-line fs-5"></i>',
      link: '/app/plan'
    }
  ];
  // End: options array


  // Language dropdown options
  //
  // Start: languages array
  public static languages = [
    {
      id: 1,
      name: 'Français',
      checked: true
    },
    {
      id: 2,
      name: 'English',
      checked: false
    }
  ];
  // End: languages array


  // Social links
  //
  // Start: social array
  public static social = [
    {
      icon: '<i class="ri-facebook-fill fs-6"></i>',
      link: '#'
    },
    {
      icon: '<i class="ri-twitter-fill fs-6"></i>',
      link: '#'
    },
    {
      icon: '<i class="ri-instagram-fill fs-6"></i>',
      link: '#'
    },
    {
      icon: '<i class="ri-pinterest-fill fs-6"></i>',
      link: '#'
    },
    {
      icon: '<i class="ri-youtube-fill fs-6"></i>',
      link: '#'
    }
  ];
  // End: social array


  // Default user object is use to show user data after login.
  // You can remove this after integration
  public static DEFAULT_USER = {
    name: 'Androws Kinny',
    cover: './assets/images/users/thumb.jpg',
    role: 'admin'
  };


  // Brand object
  public static BRAND = {
    name: 'Listen app',
    link: '/',
    logo: './assets/images/logos/logo.png',
    email: 'contact@creatoke.com'
  };


  // Mobile app data
  public static APP = [
    {
      name: 'Google Play',
      icon: '<i class="ri-google-play-fill"></i>',
      link: '#',
    },
    {
      name: 'App Store',
      icon: '<i class="ri-app-store-fill"></i>',
      link: '#',
    }
  ];


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


  // Flag to show theme setting options
  public static SETTINGS_VIEW = false;

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
