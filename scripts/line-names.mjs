// Readable English names for spoken lines whose internal keys are code letters (Sani 16 Nov: verbose names).
// Exported as a plain map: internal key without s_/app_ → line name (without the line_ prefix).
const G = { hawan: 'durbar', durbar: 'durbar', fashe: 'balloons', hanzarin: 'market_rush', market: 'market_rush', kifi: 'fishing', fish: 'fishing',
  kalangu: 'talking_drum', drum: 'talking_drum', shayi: 'tea_seller', dillali: 'auctioneer', dalar: 'groundnut_pyramids', gyada: 'groundnut_pyramids',
  suya: 'suya_seller', allo: 'writing_board', jirgi: 'ferry', kwale: 'canoes', canoes: 'canoes', ruwa: 'rain_on_the_farm', tukwane: 'clay_pots', pots: 'clay_pots',
  bulo: 'build_the_house', house: 'build_the_house', marubuci: 'letter_writer', karofi: 'dye_pits', rini: 'dye_pits', shanu: 'animal_market', garke: 'counting_herd', stars: 'stars' };
const ORD = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth'];
const UNIT_R = { k3: '3_letters', k45: '4_5_letters', klong: 'long_words', knum: 'numbers', r3: '3_letters', r4: '4_letters', r5: '5_letters', rlong: 'long_words', rnum: 'numbers' };
const FIXED = {
  act_desc_letters: 'activity_letters_description', act_desc_quiz: 'activity_find_description', act_desc_spell: 'activity_spelling_description',
  act_desc_things: 'activity_words_description', act_pick: 'activity_pick', book_or: 'book_or_press_lesson', locked: 'lesson_locked',
  board_intro: 'letters_board_intro', press_allo: 'press_black_slate', quiz_tap: 'find_tap_picture', quiz_wrong: 'find_wrong',
  remind: 'listen_this_is', scatter_intro: 'mix_up_intro', spell_intro: 'spelling_two_ways', spell_way_speak: 'spelling_way_speak',
  spell_way_tap: 'spelling_way_tap', wannan: 'this_is', yn_hint_no: 'if_not', s0: 'gender_pick', abc_say: 'letters_say_letter',
  alone2: 'sit_alone', back: 'welcome_back', closer: 'come_closer', ear: 'ear_hint', go: 'press_laila_to_begin', laila2: 'meet_laila',
  leave: 'session_end', light: 'find_brighter_spot', look: 'look_at_camera', p1: 'name_video_intro', p2: 'name_video_example',
  p3: 'name_video_your_turn', perm: 'permission_ask', perm_no: 'permission_refused', qd_q4: 'find_four_pictures_description',
  qd_qnum: 'find_numbers_description', qn_tap: 'find_numbers_tap', qn_start: 'find_numbers_start', sannu: 'hello', sp_press: 'spelling_tap_it',
  sp_spelt: 'spelling_written_like_this', still: 'hold_still', sx_intro: 'example_intro', sx_k_letters: 'example_reading_letters',
  sx_laila: 'example_laila_says', sx_now: 'example_your_turn', sx_do_say: 'example_how_to_say', sx_do_read: 'example_how_to_read',
  sx_do_spell: 'example_how_to_spell', sx_do_find: 'example_how_to_find', sx_do_findnum: 'example_how_to_find_numbers',
  sx_r_plan: 'example_spelling_plan', sx_r_w1: 'example_spelling_way_1', sx_r_w2: 'example_spelling_way_2', sx_r_v1: 'example_spelling_voice_1',
  sx_r_v2: 'example_spelling_voice_2', sx_r_kb: 'example_spelling_board', eg_watch: 'example_watch_again', eg_ok: 'example_not_right',
  wb_home: 'press_book_home', pop_timeup: 'balloons_time_up',
  w_menu_intro: 'lessons_menu_intro', w_spell_go: 'spelling_go', w_spell_test: 'spelling_test', w_tap_white: 'press_laila_to_start',
  z_speak: 'speak_press_laila', w_name: 'welcome_my_name', w_together: 'welcome_together', w_have: 'welcome_lessons',
  w_l1: 'welcome_learn_alphabet', w_l2: 'welcome_learn_read_write', w_l3: 'welcome_learn_count', w_l4: 'welcome_learn_names',
  w_more: 'welcome_more', w_talk: 'welcome_talk', b_glad: 'welcome_back_glad', b_cont: 'welcome_back_continue',
  k_intro2: 'reading_lesson_intro', k_lesson: 'reading_lesson', k_test: 'reading_test', r_intro2: 'spelling_lesson_intro', r_turn: 'spelling_your_turn',
  r_wow: 'spelling_well_done', q_again: 'find_again', q_start: 'find_start', o_inen: 'words_in_english', o_three: 'words_hard_one',
  o_allright: 'words_all_right', z_effort: 'gold_new_level', z_first: 'gold_first_level', z_keep_first: 'gold_keep_trying',
  z_keep: 'gold_keep_going', z_top: 'gold_top_level', z_top_keep: 'gold_keep_learning', n_sym2: 'numbers_symbols_11_20',
  g_learn: 'game_learn_first', g_go: 'game_continue', g_durbar_eg1: 'game_durbar_example', g_garke_eg1: 'game_counting_herd_example',
  g_durbar_ready: 'game_durbar_ready',
};
const digits = (s) => s.replace(/([a-z])(\d)/g, '$1_$2');
export function lineName(key) {
  const k = key.replace(/^(s_|app_)/, '');
  if (FIXED[k]) return FIXED[k];
  let m;
  if ((m = k.match(/^sx_w_([A-Za-z]+)$/))) return 'example_child_says_' + (m[1].length === 1 ? 'letter_' + m[1].toLowerCase() : m[1]);
  if ((m = k.match(/^cat_(desc|start)_(\w+)$/))) return `group_${m[2]}_${m[1] === 'desc' ? 'description' : 'start'}`;
  if ((m = k.match(/^spell_ord_(\d)$/))) return `spelling_${ORD[+m[1]]}_letter`;
  if ((m = k.match(/^sp_is_(\d)$/))) return `spelling_${ORD[+m[1]]}_letter_is`;
  if ((m = k.match(/^kd_(\w+)$/))) return `reading_${UNIT_R[m[1]]}_description`;
  if ((m = k.match(/^rd_(\w+)$/))) return `spelling_${UNIT_R[m[1]]}_description`;
  if ((m = k.match(/^gd_(\w+)$/)) && G[m[1]]) return `game_${G[m[1]]}_description`;
  if ((m = k.match(/^g_([a-z]+)_how$/)) && G[m[1]]) return `game_${G[m[1]]}_how`;
  if ((m = k.match(/^pop_(\w+)$/))) return 'balloons_' + m[1];
  if ((m = k.match(/^gate_(\w+)$/))) return 'balloons_gate_' + m[1];
  if ((m = k.match(/^z_got_(\d)_(\d+)$/))) return `gold_${m[1] === '3' ? 'three' : 'four'}_stars_${m[2]}`;
  if ((m = k.match(/^z_now_(\w+)$/))) return 'gold_title_' + (m[1] === 'dansarki' ? 'dan_sarki' : m[1]);
  if ((m = k.match(/^z_bag(\d)$/))) return `gold_bag_${m[1]}_full`;
  if ((m = k.match(/^z_gold_(\d+)$/))) return `gold_reached_${m[1]}`;
  if ((m = k.match(/^l_(\w+)$/))) return 'letters_' + digits(m[1]);
  if ((m = k.match(/^n_(\w+)$/))) return 'numbers_' + digits(m[1]);
  if ((m = k.match(/^o_(\w+)$/))) return 'words_' + digits(m[1]);
  return null;
}
