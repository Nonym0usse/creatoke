// Seules ces pièces de CKEditor 5 sont embarquées : importer tout le paquet
// dynamiquement empêcherait d'écarter les modules inutilisés.
export {
  ClassicEditor,
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Underline,
  Link,
  List,
  BlockQuote,
  Autoformat,
  PasteFromOffice,
} from 'ckeditor5';
export { default as fr } from 'ckeditor5/translations/fr.js';
