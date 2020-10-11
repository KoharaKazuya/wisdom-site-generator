/**
 * (命名規則に一致した) エントリ (post or comment) ファイルかどうか
 * @param {string} name
 * @return {boolean}
 */
export function isEntryFileName(name) {
  return /^[0-9]{10}-[0-9a-z-]*\.md$/.test(name);
}

/**
 * ユーザー指定の時刻、もしくはそれが不正な場合は ID から時刻の文字列を返す
 * @param {unknown} specified ユーザー指定の時刻
 * @param {string} id エントリ (post or comment) の ID
 * @return {string} 時刻を表す文字列 (ISO 8601 形式)
 */
export function entryDate(specified, id) {
  // ユーザー指定の時刻が不正でなければそれを使用する
  const s = String(specified);
  if (!Number.isNaN(new Date(s).getTime())) return s;

  // ユーザー指定の時刻が不正なら、エントリ ID から時刻を抽出する
  const epochSecond = Number(id.slice(0, 10));
  return new Date(epochSecond * 1000).toISOString();
}

/**
 * @param {unknown} value
 * @return {string[]}
 */
export function asStringArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  return [String(value)];
}

/**
 * @typedef {Object} Author
 * @property {string} name
 * @property {string} [email]
 */

/**
 * @param {unknown} value
 * @return {Author}
 */
export function asAuthor(value) {
  const s = String(value);
  const matched = s.match(/^\s*(.*?)\s*<(.*?)>\s*$/);
  if (!matched) return { name: s };
  const [, name, email] = matched;
  return { name, email };
}

/**
 * @param {unknown} value
 * @return {Author[]}
 */
export function asAuthorArray(value) {
  if (!Array.isArray(value)) return asAuthorArray([value]);
  return value.map(asAuthor);
}

/**
 * 正規化したタグを返す
 * 表記揺れによって同じ意味を指す文字が異なるタグに分類されないようにするため
 * @param {string} tag
 * @return {string}
 */
export function normalizedTag(tag) {
  return tag.replace(/\s+/g, "").toLowerCase();
}
