(function () {
  'use strict';

  var baseUrl = 'https://glauberbarcelos.com.br/';
  var personId = baseUrl + '#glauber-barcelos';

  var schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': baseUrl + '#website',
        'url': baseUrl,
        'name': 'Glauber Barcelos',
        'description': 'Engenharia de software para sites, sistemas web, aplicativos, inteligência artificial e produtos digitais.',
        'inLanguage': 'pt-BR',
        'publisher': { '@id': personId }
      },
      {
        '@type': 'WebPage',
        '@id': baseUrl + '#webpage',
        'url': baseUrl,
        'name': 'Desenvolvimento de SaaS e aplicativos para empresas | Glauber Barcelos',
        'description': 'Desenvolvimento de SaaS, aplicativos Android e iOS e consultoria técnica para empresas. Defina seu MVP, integrações e próximos passos com Glauber Barcelos.',
        'isPartOf': { '@id': baseUrl + '#website' },
        'about': { '@id': personId },
        'mainEntity': { '@id': baseUrl + '#software-service' },
        'dateModified': '2026-10-01',
        'primaryImageOfPage': {
          '@type': 'ImageObject',
          'url': baseUrl + 'img/social/glauber-compartilhamento-2026-10-01-1200x628.jpg',
          'width': 1200,
          'height': 628
        },
        'inLanguage': 'pt-BR'
      },
      {
        '@type': 'Person',
        '@id': personId,
        'name': 'Glauber Barcelos',
        'givenName': 'Glauber',
        'familyName': 'Barcelos',
        'jobTitle': 'Engenheiro de Software Sênior',
        'description': 'Engenheiro de software sênior com mais de 20 anos de experiência em produtos web, aplicativos mobile, arquitetura, APIs e inteligência artificial aplicada.',
        'url': baseUrl,
        'image': {
          '@type': 'ImageObject',
          'url': baseUrl + 'img/glauber-terno-tech.png',
          'width': 1254,
          'height': 1254
        },
        'telephone': '+5551980120387',
        'email': 'ggbarcelos@gmail.com',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Porto Alegre',
          'addressRegion': 'RS',
          'addressCountry': 'BR'
        },
        'sameAs': [
          'https://www.linkedin.com/in/glauber-gomes-barcelos/',
          'https://github.com/ggbarcelos',
          'https://www.instagram.com/glauberbarcelos.dev/'
        ],
        'knowsLanguage': ['pt-BR', 'en'],
        'knowsAbout': [
          'Desenvolvimento Web',
          'Sistemas Web e SaaS',
          'Desenvolvimento Mobile',
          'Aplicativos Android e iOS',
          'Backend e APIs REST',
          'Arquitetura de Software',
          '.NET e .NET MAUI',
          'Inteligência Artificial Aplicada',
          'Consultoria e Liderança Técnica'
        ]
      },
      {
        '@type': 'Service',
        '@id': baseUrl + '#software-service',
        'name': 'Desenvolvimento de software sob medida',
        'description': 'Projetos ponta a ponta de sites, sistemas web, aplicativos Android e iOS, APIs, IA aplicada e consultoria técnica.',
        'provider': { '@id': personId },
        'areaServed': { '@type': 'Country', 'name': 'Brasil' },
        'serviceType': 'Engenharia de software e desenvolvimento de produtos digitais',
        'url': baseUrl,
        'hasOfferCatalog': {
          '@type': 'OfferCatalog',
          'name': 'Soluções de software',
          'itemListElement': [
            {
              '@type': 'Offer',
              'itemOffered': {
                '@type': 'Service',
                'name': 'Desenvolvimento de SaaS e MVP B2B',
                'description': 'MVP, arquitetura e integrações com escopo definido.',
                'url': baseUrl + 'desenvolvimento-saas.html'
              }
            },
            {
              '@type': 'Offer',
              'itemOffered': {
                '@type': 'Service',
                'name': 'Desenvolvimento Web',
                'description': 'Sites, landing pages, sistemas web, portais e dashboards.',
                'url': baseUrl + 'desenvolvimento-web.html'
              }
            },
            {
              '@type': 'Offer',
              'itemOffered': {
                '@type': 'Service',
                'name': 'Aplicativos Android e iOS',
                'description': 'Aplicativos mobile multiplataforma com integrações e publicação nas lojas.'
              }
            },
            {
              '@type': 'Offer',
              'itemOffered': {
                '@type': 'Service',
                'name': 'Inteligência Artificial Aplicada',
                'description': 'Automação, assistentes, busca inteligente e integração de IA ao produto.'
              }
            },
            {
              '@type': 'Offer',
              'itemOffered': {
                '@type': 'Service',
                'name': 'Arquitetura, APIs e Consultoria Técnica',
                'description': 'Diagnóstico, roadmap, revisão de arquitetura, APIs e liderança técnica sob demanda.'
              }
            }
          ]
        }
      }
    ]
  };

  var script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
})();
