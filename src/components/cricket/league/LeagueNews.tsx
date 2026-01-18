import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CricketNews } from '@/lib/cricket/types';

interface CricketLeagueNewsProps {
  news: CricketNews[];
}

export function CricketLeagueNews({ news }: CricketLeagueNewsProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">League Stories</h2>
          <p className="text-sm text-gray-500">Highlights from our newsroom and analysis desk</p>
        </div>
      </div>
      <div className="grid gap-4 p-4 md:grid-cols-3">
        {news.map((article) => (
          <article key={article.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            {article.tag && (
              <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-600">
                {article.tag}
              </span>
            )}
            <h3 className="mt-3 text-base font-semibold text-gray-900">{article.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{article.summary}</p>
            <p className="mt-3 text-xs text-gray-400">
              {new Date(article.publishedAt).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <Link href={article.href} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-500">
              Read article <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

