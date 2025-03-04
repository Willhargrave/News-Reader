import { ArticleListProps } from "@/types";
export default function ArticleList({ articles, linksVisible }: ArticleListProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Top News Stories</h2>
      {articles.map((article, index) => (
        <div key={index} className="mb-6">
          <h3 className="text-xl font-bold">
            {article.feedTitle}: {article.headline}
          </h3>
          <p>{article.content}</p>
          {linksVisible && (
            <p className="mt-2">
              <a
                href={article.link}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 underline"
              >
                Read more
              </a>
            </p>
          )}
          <hr className="mt-4 border-t border-gray-300" />
        </div>
      ))}
    </div>
  );
}