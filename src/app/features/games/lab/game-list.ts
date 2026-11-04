/* The games for the list in the settings, apart from the engine so the settings never pull every game into the
   start-up script (Sani 2026-11-04: lighter start on cheap tablets). */
/** The games, for the list in the settings. The balloons are the app's own screen. */
export const GAME_LIST: { id: string; name: string; en: string; section: string; q?: Record<string, string> }[] = [
  { id: 'fashe', name: 'Fashe haruffa', en: 'Pop the balloons · the whole A–Z', section: 'Haruffa' },
  { id: 'j-durbar', name: 'Hawan Sallah', en: 'Durbar, the whole A–Z mixed up · speaking', section: 'Haruffa' },
  { id: 'j-abubuwa', name: 'Kamun kifi', en: 'Catch the fish', section: 'Abubuwa' },
  { id: 'j-magana', name: 'Kalangu', en: 'The talking drum · speaking', section: 'Abubuwa' },
  { id: 'j-dillali', name: 'Dillalin kasuwa', en: 'The auctioneer · speaking', section: 'Abubuwa' },
  { id: 'j-nemo', name: 'Hanzarin kasuwa', en: 'Market rush', section: 'Nemo hoto' },
  { id: 'j-shayi', name: 'Mai shayi', en: 'The tea seller · speaking', section: 'Nemo hoto' },
  { id: 'j-gyada', name: 'Dalar gyaɗa', en: 'The groundnut pyramids', section: 'Lambobi' },
  { id: 'j-shanu', name: 'Kasuwar dabbobi', en: 'The animal market', section: 'Lambobi' },
  { id: 'j-garke', name: 'Ƙirgen shanu', en: 'Counting the herd · speaking', section: 'Lambobi' },
  { id: 'j-suya', name: 'Mai suya', en: 'The suya seller · speaking', section: 'Lambobi' },
  { id: 'j-karatu', name: 'Kwale-kwale', en: 'The canoes', section: 'Karatu' },
  { id: 'j-allo', name: 'Allo', en: 'The writing board · speaking', section: 'Karatu' },
  { id: 'j-jirgi', name: 'Jirgin ruwa', en: 'The ferry · speaking', section: 'Karatu' },
  { id: 'j-ruwa', name: 'Ruwan sama', en: 'Rain on the farm · speaking', section: 'Karatu' },
  { id: 'j-rubutu', name: 'Tukwane', en: 'Clay pots', section: 'Rubutu' },
  { id: 'j-rubutu-say', name: 'Ginin bulo', en: 'Build the house · speaking', section: 'Rubutu' },
  { id: 'j-marubuci', name: 'Marubucin wasiƙa', en: 'The letter writer · speaking', section: 'Rubutu' },
  { id: 'j-rini', name: 'Karofi', en: 'The Kano dye pits · speaking', section: 'Rubutu' },
];
