import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Helmet } from 'react-helmet-async';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'Essência Feminina - Perfumes e Essências Exclusivas',
  description = 'Descubra fragrâncias exclusivas e sofisticadas para mulheres. Perfumes florais, doces, amadeirados e cítricos que expressam sua personalidade única.',
}) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
