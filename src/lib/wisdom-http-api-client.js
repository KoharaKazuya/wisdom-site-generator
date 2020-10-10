const apiBaseURL = "/api/v0";

export async function postComment(data) {
  const res = await fetch(`${apiBaseURL}/comments`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok)
    throw new Error(`failed to post comment: HTTP error ${res.status}`);

  const created = await res.json();
  return {
    id: created.id,
    date: new Date(created.date).toISOString(),
    author: {
      name: created.author_name,
      email: created.author_email,
    },
    content: created.content,
  };
}
