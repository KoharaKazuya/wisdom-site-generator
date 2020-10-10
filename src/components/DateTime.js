/**
 * @param {Object} props
 * @param {string} props.value
 */
export default function DateTime({ value }) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return (
    <>
      {d.getUTCFullYear()}/{d.getUTCMonth() + 1}/{d.getUTCDate()}{" "}
      {pad(d.getUTCHours())}:{pad(d.getUTCMinutes())}
    </>
  );
}

function pad(number) {
  if (number < 10) {
    return "0" + number;
  }
  return number;
}
