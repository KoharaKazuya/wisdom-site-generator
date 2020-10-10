import DateTime from "./DateTime";

export default function Comment({ id, date, author, contentHtml }) {
  return (
    <div>
      <div>
        {author.name} - <DateTime value={date} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </div>
  );
}
