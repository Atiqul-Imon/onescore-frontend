import { ReactNode } from 'react';
import { Container } from '@/components/ui';

interface PageLayoutProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

/**
 * Provides consistent spacing and headers for top-level pages.
 * Wrap page content with optional title/description/action region.
 */
export function PageLayout({
  title,
  description,
  actions,
  children,
  size = 'lg',
  className = '',
}: PageLayoutProps) {
  return (
    <div className={`section-padding bg-gray-100 ${className}`}>
      <Container size={size}>
        {(title || description || actions) && (
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              {title && <h1 className="heading-2 mb-2 lg:mb-3">{title}</h1>}
              {description && <p className="body-text text-gray-600 max-w-2xl">{description}</p>}
            </div>
            {actions && (
              <div className="flex items-center gap-3">
                {actions}
              </div>
            )}
          </div>
        )}

        <div>{children}</div>
      </Container>
    </div>
  );
}

