import { decode as base64decode, encode as base64encode } from "js-base64";

/**
 * Author ID を URL に含める形式に変換する
 * URL としてメールアドレスを直接使用したいが、以下の問題が発生するので Base64 エンコードする
 * <https://github.com/vercel/next.js/issues/16617>
 * @param {string} authorId
 * @return {string}
 */
export function serializeAuthorId(authorId) {
  return base64encode(authorId, true);
}

/**
 * Author ID を URL から復元する
 * URL としてメールアドレスを直接使用したいが、以下の問題が発生するので Base64 エンコードする
 * <https://github.com/vercel/next.js/issues/16617>
 * @param {string} authorId
 * @return {string}
 */
export function deserializeAuthorId(serialized) {
  return base64decode(serialized);
}
