// Vanilla JS copy of the suite avatar catalogue for @aireon/shared/cesium-app.
// Keep ids/labels/files in sync with src/profile/avatars.ts so React and
// vanilla apps persist the same avatar_icon value and render the same image.

const TWEMOJI_TAG = '15.1.0';
const TWEMOJI_BASE = `https://cdn.jsdelivr.net/gh/jdecked/twemoji@${TWEMOJI_TAG}/assets/svg`;
const PEOPLE_ASSET_TAG = 'v1.14.0';
const PEOPLE_BASE = `https://cdn.jsdelivr.net/gh/mbuchi/aireon-shared@${PEOPLE_ASSET_TAG}/assets/avatars`;

export const avatarOptions = [
  // --- People (illustrated portraits) ---------------------------------------
  { id: 'person-01', label: 'Mia',   group: 'people', file: 'person-01.webp', tint: '#d7e3c3' },
  { id: 'person-02', label: 'Leo',   group: 'people', file: 'person-02.webp', tint: '#c7e2e0' },
  { id: 'person-03', label: 'Lena',  group: 'people', file: 'person-03.webp', tint: '#ecccd2' },
  { id: 'person-04', label: 'Noah',  group: 'people', file: 'person-04.webp', tint: '#d3e1bd' },
  { id: 'person-05', label: 'Luca',  group: 'people', file: 'person-05.webp', tint: '#cfe3e1' },
  { id: 'person-06', label: 'Nina',  group: 'people', file: 'person-06.webp', tint: '#bcd6d2' },
  { id: 'person-07', label: 'Felix', group: 'people', file: 'person-07.webp', tint: '#f1cfa0' },
  { id: 'person-08', label: 'Clara', group: 'people', file: 'person-08.webp', tint: '#d8cce0' },
  { id: 'person-09', label: 'Theo',  group: 'people', file: 'person-09.webp', tint: '#c6dcea' },
  { id: 'person-10', label: 'Maya',  group: 'people', file: 'person-10.webp', tint: '#ccdcae' },

  // --- People (illustrated headshots, female + male, interleaved) -----------
  { id: 'female-01', label: 'Emma',    group: 'people', file: 'female-01.webp', tint: '#eef2f7' },
  { id: 'male-01', label: 'Liam',    group: 'people', file: 'male-01.webp', tint: '#eef2f7' },
  { id: 'female-02', label: 'Sofia',   group: 'people', file: 'female-02.webp', tint: '#eef2f7' },
  { id: 'male-02', label: 'Elias',   group: 'people', file: 'male-02.webp', tint: '#eef2f7' },
  { id: 'female-03', label: 'Elena',   group: 'people', file: 'female-03.webp', tint: '#eef2f7' },
  { id: 'male-03', label: 'Jonas',   group: 'people', file: 'male-03.webp', tint: '#eef2f7' },
  { id: 'female-04', label: 'Sara',    group: 'people', file: 'female-04.webp', tint: '#eef2f7' },
  { id: 'male-04', label: 'David',   group: 'people', file: 'male-04.webp', tint: '#eef2f7' },
  { id: 'female-05', label: 'Lara',    group: 'people', file: 'female-05.webp', tint: '#eef2f7' },
  { id: 'male-05', label: 'Samuel',  group: 'people', file: 'male-05.webp', tint: '#eef2f7' },
  { id: 'female-06', label: 'Anna',    group: 'people', file: 'female-06.webp', tint: '#eef2f7' },
  { id: 'male-06', label: 'Nico',    group: 'people', file: 'male-06.webp', tint: '#eef2f7' },
  { id: 'female-07', label: 'Julia',   group: 'people', file: 'female-07.webp', tint: '#eef2f7' },
  { id: 'male-07', label: 'Tim',     group: 'people', file: 'male-07.webp', tint: '#eef2f7' },
  { id: 'female-08', label: 'Laura',   group: 'people', file: 'female-08.webp', tint: '#eef2f7' },
  { id: 'male-08', label: 'Jan',     group: 'people', file: 'male-08.webp', tint: '#eef2f7' },
  { id: 'female-09', label: 'Chiara',  group: 'people', file: 'female-09.webp', tint: '#eef2f7' },
  { id: 'male-09', label: 'Levin',   group: 'people', file: 'male-09.webp', tint: '#eef2f7' },
  { id: 'female-10', label: 'Alina',   group: 'people', file: 'female-10.webp', tint: '#eef2f7' },
  { id: 'male-10', label: 'Gabriel', group: 'people', file: 'male-10.webp', tint: '#eef2f7' },
  { id: 'female-11', label: 'Emilia',  group: 'people', file: 'female-11.webp', tint: '#eef2f7' },
  { id: 'male-11', label: 'Matteo',  group: 'people', file: 'male-11.webp', tint: '#eef2f7' },
  { id: 'female-12', label: 'Nora',    group: 'people', file: 'female-12.webp', tint: '#eef2f7' },
  { id: 'male-12', label: 'Lukas',   group: 'people', file: 'male-12.webp', tint: '#eef2f7' },
  { id: 'female-13', label: 'Marie',   group: 'people', file: 'female-13.webp', tint: '#eef2f7' },
  { id: 'male-13', label: 'Simon',   group: 'people', file: 'male-13.webp', tint: '#eef2f7' },
  { id: 'female-14', label: 'Sophie',  group: 'people', file: 'female-14.webp', tint: '#eef2f7' },
  { id: 'male-14', label: 'Fabio',   group: 'people', file: 'male-14.webp', tint: '#eef2f7' },
  { id: 'female-15', label: 'Eva',     group: 'people', file: 'female-15.webp', tint: '#eef2f7' },
  { id: 'male-15', label: 'Aaron',   group: 'people', file: 'male-15.webp', tint: '#eef2f7' },
  { id: 'female-16', label: 'Alice',   group: 'people', file: 'female-16.webp', tint: '#eef2f7' },
  { id: 'male-16', label: 'Julian',  group: 'people', file: 'male-16.webp', tint: '#eef2f7' },
  { id: 'female-17', label: 'Ella',    group: 'people', file: 'female-17.webp', tint: '#eef2f7' },
  { id: 'male-17', label: 'Marco',   group: 'people', file: 'male-17.webp', tint: '#eef2f7' },
  { id: 'female-18', label: 'Zoe',     group: 'people', file: 'female-18.webp', tint: '#eef2f7' },
  { id: 'male-18', label: 'Nael',    group: 'people', file: 'male-18.webp', tint: '#eef2f7' },
  { id: 'female-19', label: 'Greta',   group: 'people', file: 'female-19.webp', tint: '#eef2f7' },
  { id: 'male-19', label: 'Robin',   group: 'people', file: 'male-19.webp', tint: '#eef2f7' },
  { id: 'female-20', label: 'Aurora',  group: 'people', file: 'female-20.webp', tint: '#eef2f7' },

  // --- Emoji (cute animals, Twemoji SVGs) -----------------------------------
  { id: 'fox',     label: 'Fox',     group: 'emoji', codepoint: '1f98a', tint: '#fde4d3' },
  { id: 'panda',   label: 'Panda',   group: 'emoji', codepoint: '1f43c', tint: '#e8eef2' },
  { id: 'tiger',   label: 'Tiger',   group: 'emoji', codepoint: '1f42f', tint: '#fdeecb' },
  { id: 'koala',   label: 'Koala',   group: 'emoji', codepoint: '1f428', tint: '#e3e7ea' },
  { id: 'owl',     label: 'Owl',     group: 'emoji', codepoint: '1f989', tint: '#ece1d2' },
  { id: 'rabbit',  label: 'Rabbit',  group: 'emoji', codepoint: '1f430', tint: '#f6e7ee' },
  { id: 'cat',     label: 'Cat',     group: 'emoji', codepoint: '1f431', tint: '#fbe6cf' },
  { id: 'dog',     label: 'Dog',     group: 'emoji', codepoint: '1f436', tint: '#f0e4d4' },
  { id: 'bear',    label: 'Bear',    group: 'emoji', codepoint: '1f43b', tint: '#e9ddcf' },
  { id: 'monkey',  label: 'Monkey',  group: 'emoji', codepoint: '1f435', tint: '#ede0d1' },
  { id: 'penguin', label: 'Penguin', group: 'emoji', codepoint: '1f427', tint: '#dde6ec' },
  { id: 'lion',    label: 'Lion',    group: 'emoji', codepoint: '1f981', tint: '#fdeccb' },
  { id: 'frog',    label: 'Frog',    group: 'emoji', codepoint: '1f438', tint: '#dff0d8' },
  { id: 'chick',   label: 'Chick',   group: 'emoji', codepoint: '1f425', tint: '#fdf3cf' },
  { id: 'unicorn', label: 'Unicorn', group: 'emoji', codepoint: '1f984', tint: '#f1e3f5' },
  { id: 'octopus', label: 'Octopus', group: 'emoji', codepoint: '1f419', tint: '#f7dde0' },

];

export function avatarUrl(opt) {
    if (opt.file) return `${PEOPLE_BASE}/${opt.file}`;
    return `${TWEMOJI_BASE}/${opt.codepoint}.svg`;
}

export function avatarUrlById(id) {
    if (!id) return null;
    const opt = avatarOptions.find((a) => a.id === id);
    return opt ? avatarUrl(opt) : null;
}
