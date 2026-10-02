# Banners — Glauber Barcelos / Portal

Campanha baseada na nova página e na identidade Portal: azul elétrico, fundo azul-marinho, branco e pontos lima. Portais tridimensionais representam a conexão entre processos, engenharia e IA. Sem fotografia ou representação de Glauber.

## Arquivos para publicação

| Arquivo | Uso | Dimensões |
| --- | --- | --- |
| linkedin.png / .jpg | Publicação horizontal no LinkedIn | 1200 × 627 px |
| instagram.png / .jpg | Feed do Instagram; também compatível com feed vertical do Facebook | 1080 × 1350 px |
| facebook-whatsapp.png / .jpg | Feed quadrado do Facebook, mensagens e grupos do WhatsApp | 1080 × 1080 px |
| status-stories.png / .jpg | WhatsApp Status, Instagram Stories e Facebook Stories | 1080 × 1920 px |

Use PNG para manter textos nítidos ou JPG para arquivos menores. Cada peça foi composta para seu formato; não estique a horizontal para Stories. As margens protegem os conteúdos principais; elementos gráficos decorativos podem chegar às bordas. Em Stories, confira a prévia antes de publicar: a interface e os stickers podem cobrir a arte.

Estes são formatos escolhidos para compartilhamento e publicação, não capas de perfil. As redes aceitam múltiplos formatos e não exigem um único tamanho de imagem para todos os usos. O WhatsApp não estabelece nessas orientações um tamanho obrigatório em pixels para fotos de Status; 1080 × 1920 é a opção vertical de produção deste pacote.

## Referências de formato

- [LinkedIn: imagens personalizadas em publicações com URL](https://www.linkedin.com/help/lms/answer/a567368): referência horizontal de 1200 × 627, proporção 1,91:1.
- [LinkedIn: compartilhamento de fotos](https://www.linkedin.com/help/linkedin/answer/a527229): fotos podem ser publicadas em outras proporções, incluindo 4:5.
- [Instagram: resolução de fotos](https://help.instagram.com/1631821640426723): página oficial de referência; leitura automatizada indisponível nesta execução. Foi usado o formato 4:5 de 1080 × 1350 para o feed.
- [Meta: formatos de Facebook Feed](https://www.facebook.com/business/ads-guide/image/facebook-feed) e [Instagram Stories](https://www.facebook.com/business/ads-guide/image/instagram-story): as páginas exigiram login nesta consulta. Para este pacote orgânico, foram escolhidos os formatos usuais 1:1, 4:5 e 9:16; não são uma certificação de requisitos de anúncios.
- [WhatsApp: criar e compartilhar Status](https://faq.whatsapp.com/643144237275579/?category=5245234&cms_platform=web&locale=pt_BR): permite compartilhar fotos e alerta que a qualidade pode diminuir no Status.

## Produção e origem

Artes geradas com a ferramenta nativa `image_gen`, usando `img/brand/glauber-signature.png` como referência da marca. A logo e os textos fazem parte da composição gerada. Os prompts completos estão em `prompts.json`. Não foi usada API/CLI de geração externa.

Os arquivos originais foram preservados em `originais/`. O script `scripts/export-social-banners.mjs` exporta PNG e JPG nas dimensões finais, sem alterar o conteúdo. A conferência de dimensões está em `validacao.json`.

## Textos alternativos

- LinkedIn: Banner azul-marinho com a marca Glauber Barcelos e a frase “IA acelera. Contexto dá direção.” Portais azuis e metálicos em sequência são atravessados por linhas com pequenos pontos lima.
- Instagram: Banner vertical com “A tecnologia evolui. Seu negócio vai além.”, a marca e três portais azuis conectados. Complemento: “Mais performance. Menos custo operacional.”
- Facebook e WhatsApp: Banner quadrado com “Tecnologia com visão de negócio.” e “Engenharia e IA para melhorar a performance e reduzir custos.” Portais tridimensionais ocupam a parte inferior direita.
- Status e Stories: Banner vertical com “Seu próximo avanço começa com contexto.”, portais azuis conectados e a chamada “Vamos conversar”, acompanhada de glauberbarcelos.com.br.
