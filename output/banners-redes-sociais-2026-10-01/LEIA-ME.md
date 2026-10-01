# Banners de Glauber Barcelos

Peças para publicações, compartilhamento de imagens e Status. Arquivos JPEG com composição própria para cada proporção e dimensões exatas verificadas após a exportação.

| Arquivo | Tamanho | Uso sugerido |
| --- | --- | --- |
| banner-linkedin-1200x628.jpg | 1200 × 628 px, horizontal | Publicação com imagem no LinkedIn; opção horizontal para Facebook |
| banner-facebook-whatsapp-1200x1200.jpg | 1200 × 1200 px, quadrado | Feed do Facebook e envio em conversas do WhatsApp; também pode ser usado no feed do LinkedIn |
| banner-status-1080x1920.jpg | 1080 × 1920 px, vertical | Status do WhatsApp e Stories do Facebook |

Os tamanhos são formatos de entrega escolhidos para esses usos. A documentação oficial do LinkedIn recomenda 1200 × 628 px para imagem horizontal e 1200 × 1200 px para imagem quadrada em anúncios de imagem única: https://www.linkedin.com/help/linkedin/answer/a426534

Não há um único tamanho obrigatório para todas as publicações orgânicas. Para WhatsApp, 1080 × 1920 px é uma escolha de composição em 9:16 para tela vertical; 1200 × 1200 px é uma opção para envio de imagem em conversas. A aparência das prévias pode variar conforme o aparelho e a interface.

Envie a imagem junto com o texto. Cole o link também na legenda ou na mensagem para que fique clicável. No WhatsApp, selecione qualidade HD quando disponível. Para preservar o arquivo original em uma conversa, envie como documento.

As peças foram criadas com a ferramenta integrada image_gen, usando a fotografia facial e a logomarca oficiais da skill glauber-b2b-social-content. Os retratos são composições geradas com IA a partir da referência facial. A exportação JPEG foi feita com sips. Os prompts completos estão em prompts.txt; os textos por plataforma e o texto alternativo estão em textos-para-compartilhar.md.

Verificação visual: texto em português, endereço do site, logomarca inteira, rosto livre de sobreposições e área livre ampliada no topo e na base do Status.

Integração no site: a versão horizontal está em `img/social/glauber-compartilhamento-2026-10-01-1200x628.jpg` e é referenciada pelas tags Open Graph e Twitter nas seis páginas HTML e por `primaryImageOfPage` em `js/schema.js`. O nome inclui a data para identificar a nova versão. As redes podem manter em cache uma prévia antiga até buscar novamente o link.
