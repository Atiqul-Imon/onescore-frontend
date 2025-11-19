"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

type Article = {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  heroImage?: string;
  category: 'cricket' | 'football' | 'general';
  type: 'breaking' | 'match_report' | 'analysis' | 'feature' | 'interview' | 'opinion';
  tags?: string[];
  publishedAt?: string;
  author?: { name?: string };
};

export function ArticleCard({ article }: { article: Article }) {
  const href = `/${article.slug}`; // slug already includes news/yyyy/mm/...
  return (
    <Card variant="interactive" padding="sm" className="overflow-hidden">
      {article.heroImage ? (
        <Link href={href} className="block">
          <Image
            src={article.heroImage}
            alt={article.title}
            width={800}
            height={450}
            className="w-full h-48 object-cover"
          />
        </Link>
      ) : null}
      <div>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Badge variant="info" size="sm">{article.category}</Badge>
          <Badge variant="default" size="sm">{article.type.replace('_', ' ')}</Badge>
          {article.publishedAt && (
            <time dateTime={article.publishedAt} className="text-xs text-gray-500">
              {formatDate(article.publishedAt)}
            </time>
          )}
        </div>
        <h3 className="heading-4 mb-2 leading-snug">
          <Link href={href} className="hover:underline transition-standard">
            {article.title}
          </Link>
        </h3>
        {article.summary && (
          <p className="body-text-sm line-clamp-3">{article.summary}</p>
        )}
      </div>
    </Card>
  );
}


