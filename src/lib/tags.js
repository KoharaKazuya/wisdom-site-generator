import { normalizedTag } from "./content";
import { getAllPosts } from "./posts";

export async function getAllNormalizedTags() {
  const allPosts = await getAllPosts();

  // flatten and unique
  const allTags = allPosts.reduce(
    (accu, { tags }) => [
      ...accu,
      ...tags.map(normalizedTag).filter((x) => !accu.includes(x)),
    ],
    []
  );

  return allTags.sort();
}
