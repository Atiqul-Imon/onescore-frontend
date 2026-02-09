import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface ArticleBreadcrumbsProps {
  category: string;
  articleTitle: string;
}

export function ArticleBreadcrumbs({ category, articleTitle }: ArticleBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol
        className="flex flex-wrap items-center gap-2 text-sm text-gray-600"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-primary-600 transition-colors"
            itemProp="item"
          >
            <Home className="h-4 w-4" />
            <span itemProp="name">Home</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>
        <ChevronRight className="h-4 w-4 text-gray-400" />
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <Link href="/news" className="hover:text-primary-600 transition-colors" itemProp="item">
            <span itemProp="name">News</span>
          </Link>
          <meta itemProp="position" content="2" />
        </li>
        <ChevronRight className="h-4 w-4 text-gray-400" />
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <Link
            href={`/news?category=${encodeURIComponent(category)}`}
            className="hover:text-primary-600 transition-colors"
            itemProp="item"
          >
            <span itemProp="name">{category}</span>
          </Link>
          <meta itemProp="position" content="3" />
        </li>
        <ChevronRight className="h-4 w-4 text-gray-400" />
        <li
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
          className="text-gray-900 font-medium"
        >
          <span itemProp="name" className="line-clamp-1">
            {articleTitle}
          </span>
          <meta itemProp="position" content="4" />
        </li>
      </ol>
    </nav>
  );
}
