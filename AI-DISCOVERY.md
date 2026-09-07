# Estratégia de descoberta em ChatGPT, Copilot e Claude

## O objetivo real

O objetivo não é “enganar” um modelo para mencionar o site. É fazer com que, quando uma pessoa perguntar quem pode criar um produto web, aplicativo, solução com IA ou arquitetura de software no Brasil, os sistemas encontrem uma entidade pública, consistente, rastreável e fácil de citar: Glauber Barcelos.

Nenhuma plataforma garante recomendação, posição ou citação. As respostas podem variar por país, momento, fonte de busca, histórico e intenção. A estratégia aumenta elegibilidade e clareza; não compra presença.

## Como cada ecossistema deve ser tratado

### ChatGPT

O crawler de busca da OpenAI é o `OAI-SearchBot`. Ele está liberado no `robots.txt`; o `GPTBot` ficou bloqueado porque está associado a treinamento e não é necessário para a busca do ChatGPT. O `ChatGPT-User` também está liberado para acessos iniciados pelo usuário.

### Copilot

O caminho prioritário é Bing: manter o `bingbot` liberado, cadastrar o domínio no Bing Webmaster Tools, enviar o sitemap e corrigir eventuais problemas de rastreamento. A consistência das páginas e dos links externos continua sendo mais importante do que criar um arquivo especial.

### Claude

O `ClaudeBot` está liberado para o conteúdo público, mas a Anthropic não oferece uma garantia de recomendação semelhante a um cadastro de empresa. A estratégia deve ser fortalecer o site, o perfil profissional e as referências públicas que podem ser encontradas por diferentes índices.

## Sinais controláveis implementados

- `robots.txt` permite crawlers de busca e bloqueia apenas artefatos técnicos.
- `GPTBot` foi separado de `OAI-SearchBot`, deixando explícita a escolha entre busca e treinamento.
- `llms.txt` resume identidade, serviços, cases e links oficiais para ferramentas que optarem por consumi-lo.
- JSON-LD conecta a pessoa, o site e o serviço de desenvolvimento de software.
- O site usa textos reais no HTML, títulos claros, links internos e páginas de serviço distintas.
- LinkedIn, GitHub e Instagram aparecem como referências da mesma entidade.
- Cases nomeiam contexto, tipo de entrega e cliente/parceiro quando essa relação foi autorizada publicamente.

`llms.txt` é um ativo opcional de interoperabilidade, não um requisito do Google e não uma garantia de presença em IA. O próprio Google informa que não usa esse arquivo como requisito para AI Overviews ou AI Mode; ele pode ser mantido apenas para serviços que decidirem adotá-lo.

## Entidade e autoridade

Manter os mesmos dados em todos os lugares:

- “Glauber Barcelos” como nome principal;
- “Engenheiro de Software Sênior / Tech Lead” como descrição profissional;
- Porto Alegre, RS, Brasil como base;
- atendimento remoto no Brasil;
- C#, .NET, .NET MAUI, web, mobile, APIs, SaaS e IA aplicada como especialidades;
- o mesmo site, LinkedIn e GitHub conectados entre si.

O LinkedIn deve repetir a proposta do site no título, resumo e experiências. O GitHub deve ter um README de perfil com a mesma descrição, links para o site e projetos públicos que comprovem as competências. A empresa/parceiro só deve ser citado em um case com autorização e contexto verdadeiro.

## Consultas que devem orientar o conteúdo

Testar mensalmente estas perguntas nos três ambientes, sempre em janela anônima quando possível:

- “Quem pode desenvolver um sistema web .NET sob medida no Brasil?”
- “Quem cria aplicativos Android e iOS com .NET MAUI?”
- “Quem contratar para ser Tech Lead sob demanda?”
- “Quem faz consultoria de arquitetura e APIs para produto digital?”
- “Quem pode aplicar inteligência artificial em um produto existente?”
- “Quais profissionais têm experiência com projetos digitais em saúde?”

O que medir: se Glauber aparece, se a descrição está correta, se a fonte citada é o site ou LinkedIn, se a resposta aponta para a página adequada e se existe um caminho claro até o contato.

## Conteúdo que aumenta a chance de citação

### Páginas de serviço

Cada página deve responder logo no início:

1. o que é entregue;
2. para qual tipo de negócio;
3. quais decisões técnicas estão incluídas;
4. o que fica pronto ao final;
5. como iniciar o diagnóstico.

### Conteúdo de autoridade

Priorizar páginas próprias e casos detalhados, não artigos genéricos:

- “Como decidir entre site, sistema web e SaaS?”
- “O que um aplicativo empresarial precisa antes de chegar à loja?”
- “Como avaliar se IA faz sentido em um processo?”
- “Quando uma empresa precisa de Tech Lead sob demanda?”
- “O que revisar antes de escalar uma API?”

Em cada conteúdo, começar com uma resposta curta e objetiva, depois explicar critérios, trade-offs e exemplos. A experiência real de Glauber é o diferencial que impede o material de virar conteúdo intercambiável.

### Cases

Transformar os cases mais fortes em páginas próprias com a estrutura: contexto, problema, decisão, arquitetura/entrega, impacto observável e tecnologias. Evitar inventar métricas; quando não houver número público, descrever claramente o resultado operacional ou comercial.

## Distribuição fora do site

- Publicar no LinkedIn a decisão técnica por trás de cada case, com link para a página correspondente.
- Atualizar o README do GitHub e fixar repositórios ou exemplos públicos coerentes com o posicionamento.
- Buscar menções reais em parceiros, eventos, comunidades e empresas atendidas.
- Solicitar que clientes/parceiros autorizados mantenham uma referência com o nome completo e link do site.
- Cadastrar o site no Bing Webmaster Tools e no Google Search Console.
- Não comprar links, fabricar avaliações, criar perfis em massa ou publicar textos genéricos gerados em escala.

## Plano de execução em 90 dias

### Dias 1–15 — descoberta técnica

- Publicar as alterações atuais.
- Validar o `robots.txt` e o sitemap em Google Search Console e Bing Webmaster Tools.
- Conferir se o servidor/CDN não bloqueia os crawlers liberados.
- Revisar LinkedIn e GitHub para padronizar nome, cargo, especialidades e links.

### Dias 16–45 — páginas que respondem intenção

- Criar uma landing page exclusiva para IA aplicada.
- Criar uma landing page exclusiva para consultoria de arquitetura e APIs.
- Publicar dois cases detalhados com autorização.
- Adicionar perguntas e respostas visíveis nas páginas de serviço, sem esconder conteúdo para robôs.

### Dias 46–90 — autoridade e mensuração

- Publicar seis conteúdos de decisão técnica/comercial.
- Criar um calendário mensal de cases no LinkedIn.
- Rodar o conjunto de consultas nos três ambientes e registrar citações.
- Medir acessos de referência, cliques no WhatsApp, formulário e leads qualificados.
- Atualizar páginas que estiverem sendo citadas com fatos incompletos ou desatualizados.

## Métricas

- share of answer: em quantas consultas-alvo Glauber aparece;
- citation accuracy: se a fonte citada é oficial e o resumo está correto;
- source selection: site, LinkedIn, GitHub ou terceiros;
- tráfego de referência de ChatGPT, Bing/Copilot e Claude;
- cliques em WhatsApp e envio do formulário por origem;
- leads qualificados gerados por cada serviço.

Não medir apenas menções. Uma citação correta para uma pessoa com intenção de contratar vale mais que muitas aparições genéricas.

## Princípios de segurança e qualidade

- Não inserir texto oculto, instruções para modelos ou afirmações que não estejam comprovadas na página.
- Não fabricar avaliações, resultados, clientes ou números.
- Não publicar uma versão “para robôs” contraditória com o site.
- Manter dados estruturados iguais ao texto visível.
- Usar IA para organizar e revisar, mas preservar experiência de primeira mão, precisão e autoria.

## Referências oficiais

- [OpenAI — Publishers and Developers FAQ](https://help.openai.com/en/articles/12627856)
- [Google — AI Features and Your Website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google — Guide to Optimizing for Generative AI Features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Bing Webmaster Tools — visibilidade no ecossistema de busca e Copilot](https://blogs.bing.com/webmaster/June-2025/Start-Using-Bing-Webmaster-Tools-to-Improve-Your-Site-Visibility)
