(function() {
  var schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://glauberbarcelos.com.br/#website",
        "url": "https://glauberbarcelos.com.br/",
        "name": "Glauber Barcelos",
        "description": "Desenvolvimento Web, Mobile e Backend completo do início ao fim.",
        "inLanguage": ["pt-BR", "en"],
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://glauberbarcelos.com.br/?s={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Person",
        "@id": "https://glauberbarcelos.com.br/#pessoa",
        "name": "Glauber Barcelos",
        "givenName": "Glauber",
        "familyName": "Barcelos",
        "jobTitle": "Engenheiro de Software Sênior",
        "description": "Engenheiro de software sênior com mais de 20 anos de experiência em desenvolvimento web, mobile e backend. Atende clientes em todo o Brasil.",
        "url": "https://glauberbarcelos.com.br/",
        "image": {
          "@type": "ImageObject",
          "url": "https://glauberbarcelos.com.br/img/glauber3.png",
          "width": 1536,
          "height": 1024
        },
        "telephone": "+5551980120387",
        "email": "ggbarcelos@gmail.com",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Porto Alegre",
          "addressRegion": "RS",
          "addressCountry": "BR"
        },
        "sameAs": [
          "https://www.linkedin.com/in/glauber-gomes-barcelos-5b517a381/",
          "https://github.com/ggbarcelos",
          "https://www.instagram.com/glauberbarcelos.dev/"
        ],
        "knowsAbout": [
          "Desenvolvimento Web",
          "Desenvolvimento Mobile",
          "Backend e APIs REST",
          "Android e iOS",
          "SaaS",
          "MVP",
          ".NET MAUI",
          "Inteligência Artificial"
        ]
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://glauberbarcelos.com.br/#servico",
        "name": "Glauber Barcelos — Desenvolvimento de Software",
        "description": "Desenvolvimento de projetos completos de software: sites, sistemas web, APIs, apps Android e iOS. Atendimento em todo o Brasil.",
        "url": "https://glauberbarcelos.com.br/",
        "telephone": "+5551980120387",
        "email": "ggbarcelos@gmail.com",
        "image": "https://glauberbarcelos.com.br/img/glauber3.png",
        "priceRange": "$$",
        "currenciesAccepted": "BRL",
        "paymentAccepted": "PIX, Transferência bancária",
        "provider": { "@id": "https://glauberbarcelos.com.br/#pessoa" },
        "areaServed": [
          { "@type": "Country", "name": "Brasil" },
          { "@type": "Country", "name": "US" },
          { "@type": "Country", "name": "Worldwide" }
        ],
        "serviceType": [
          "Desenvolvimento Web",
          "Criação de Sites",
          "Sistemas Web",
          "Backend e APIs",
          "Desenvolvimento Mobile",
          "Aplicativos Android",
          "Aplicativos iOS",
          "MVP",
          "SaaS"
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Serviços de Desenvolvimento de Software",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Desenvolvimento Web",
                "description": "Sites, landing pages, sistemas web e plataformas SaaS com foco em performance e conversão."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Backend e APIs",
                "description": "APIs REST, banco de dados, arquitetura escalável e integrações com serviços de terceiros."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Aplicativos Mobile",
                "description": "Aplicativos Android e iOS multiplataforma com publicação nas lojas App Store e Google Play."
              }
            }
          ]
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Quanto tempo leva para desenvolver um MVP?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Em geral entre 4 e 8 semanas, dependendo do escopo e das integrações necessárias. O processo começa com um diagnóstico para definir o que entra no MVP e o que pode ficar para versões futuras."
            }
          },
          {
            "@type": "Question",
            "name": "Você desenvolve aplicativos para Android e iOS?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim. Trabalho com desenvolvimento multiplataforma, entregando apps para Android e iOS a partir de uma única base de código, reduzindo custo e prazo de entrega."
            }
          },
          {
            "@type": "Question",
            "name": "Você cuida de todo o projeto ou só do código?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Cuido de todas as etapas: diagnóstico, planejamento, desenvolvimento (front-end, back-end e mobile) e entrega final. Você não precisa contratar múltiplos fornecedores."
            }
          },
          {
            "@type": "Question",
            "name": "Atende clientes fora de Porto Alegre?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim, atendo clientes remotamente no Brasil e no exterior. Todo o processo de alinhamento, acompanhamento e entrega é feito de forma online."
            }
          },
          {
            "@type": "Question",
            "name": "Como posso solicitar um orçamento?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Você pode entrar em contato pelo WhatsApp (51) 98012-0387 ou pelo formulário do site. Em menos de 24h retorno com os próximos passos."
            }
          }
        ]
      }
    ]
  };

  var script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
})();
