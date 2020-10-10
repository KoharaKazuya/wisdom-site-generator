import { getAllPosts } from "./posts";

export async function getAllAuthorIds() {
  const allPosts = await getAllPosts();

  // flatten and unique
  const allAuthors = allPosts.reduce(
    (accu, { authors }) => [
      ...accu,
      ...authors
        .map(({ email }) => email)
        .filter((x) => x && !accu.includes(x)),
    ],
    []
  );

  return allAuthors.sort();
}

/**
 * @param {string} id
 */
export async function getAuthorData(id) {
  const q = encodeURIComponent(`${id} in:email`);
  const res = await fetch(
    `https://api.github.com/search/users?q=${q}&per_page=10`
  );
  if (!res.ok) throw new Error("cannot fetch user data from GitHub");
  const { items } = await res.json();
  if (items.length === 0) return null;

  const githubUsers = await Promise.all(
    items.map(async (user) => {
      const res = await fetch(user.url);
      if (!res.ok)
        throw new Error(`cannot fetch user (${user.login}) data from GitHub`);
      return res.json();
    })
  );

  const found = githubUsers.find((user) => user.email === id);
  const githubUserData = found || githubUsers[0];

  return {
    id,
    name: githubUserData.name,
    imageUrl: githubUserData.avatar_url,
    biography: githubUserData.bio,
    githubUserPageUrl: githubUserData.html_url,
  };
}
