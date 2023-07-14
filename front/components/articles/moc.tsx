export const LOREM = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";
export const BASE_TAGS = ["Kubernetes", "Microk8s", "Django"];

function random(seed) {
  // simple adoptions so we get something almost random that is seedable
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

const generateRandomTags = ({ amount, seed }) => {
  const tags = BASE_TAGS;
  return tags
    .sort(() => random(seed) - 0.5)
    .slice(0, Math.floor(random(seed) * 3));
};

export const hundretRandomTags = Array.from({ length: 100 }, (_, i) =>
  generateRandomTags({ amount: 3, seed: i }),
);


const generateArticle = ({ i }) => {
  return {
    title: `Article ${i}`,
    uuid: `id-${i}`,
    tags: hundretRandomTags[i],
    description: "This is the first article",
    image: "https://picsum.photos/seed/picsum/200/300",
    author: {
      first_name: "John",
      second_name: "Doe",
      image: "https://picsum.photos/seed/picsum/200/300",
    },
  };
};
export const ARTICLES = Array.from({ length: 10 }, (_, i) => generateArticle({ i }));
