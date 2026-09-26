# Entrega B2B: decisões e validação local

Trabalho de 26/09/2026 sobre o checkout inicial `4c5354b`. Sem build, bundler ou framework: HTML/CSS/JS estáticos. A inspeção confirmou que a home e os serviços atuais já não usam Bootstrap, apesar de referências antigas na documentação. Os serviços mantêm estilos inline.

**Nenhum deploy, push, alteração de credenciais ou envio real de mensagem foi realizado.** Os arquivos não rastreados preexistentes (`AGENTS.md`, `graphify-out/`, `opencode.json`, imagens `carrossel-*` e `ai-applied.png`) foram preservados.

## Decisões e arquivos

| Arquivos | Mudança / motivo |
| --- | --- |
| `index.html`, `css/styles.css` | H1 SaaS/apps para empresas, benefício e dois CTAs; acesso ao diagnóstico; serviços e cases mantidos; formulário opcional por tipo; navegação e conteúdo úteis sem JS |
| `desenvolvimento-saas.html` | Nova intenção comercial: fit, MVP, recursos condicionais, arquitetura, integrações, etapas, FAQ, referência delimitada e CTA |
| `desenvolvimento-web.html` | URL preservada; foco em landing pages, sites, portais e sistemas internos, separado de SaaS |
| `desenvolvimento-mobile-desktop.html`, `dev-as-a-service.html` | H1 próprio, entregáveis, perguntas comerciais, limites de escopo e CTAs específicos |
| `case-native-ip.html` | Estrutura de case: contexto, escopo documentado, interface e limites; não atribui desenvolvimento do SaaS |
| `js/diagnostic.js` | Quatro perguntas nativas, voltar/rever, orientação combinando todas as respostas, case pertinente e prévia de WhatsApp codificada |
| `js/main.js` | Erros e status acessíveis, mocks testáveis, timeout, proteção contra duplicidade, fallback acionado pelo visitante; tolerância à ausência de SDK/storage |
| `js/i18n.js` | Novos textos PT/EN no registro existente; troca de idioma atualiza diagnóstico e resultado; storage bloqueado não interrompe o fluxo |
| `js/analytics-config.js`, `js/analytics.js` | Integração desativada, consentimento explícito, eventos com categorias fechadas e UTMs aprovadas |
| `js/schema.js`, `sitemap.xml` | SaaS no catálogo, metadados alinhados, seis URLs canônicas; datas verificadas pelo mtime real local de edição em 26/09/2026 |
| `img/{logo_glauber,glauber-terno-tech,web-products-editorial,mobile-apps-editorial,ai-applied-editorial,architecture-apis-editorial}.webp` | Seis derivados otimizados, com originais preservados em `<picture>`; reuso do WebP de Banana já existente |
| `EMAILJS_SETUP.md` | Corrige documentação antiga que descrevia um fallback automático por mailto inexistente no código inicial |
| `tests/`, `docs/` | Verificações reproduzíveis, evidências, contrato de analytics e modelo editorial de case |

`robots.txt` foi inspecionado e mantido: permite indexação normal, aponta para o sitemap correto e preserva as opções existentes para crawlers de IA. Não há canonical alternativo ou alteração das URLs existentes. As páginas de serviço continuam em português, como antes; os textos novos estão cadastrados também em inglês. A home mantém o alternador PT/EN.

## Testes executados

- `tests/check_site.py`: seis páginas, um H1 por página, metadados distintos, JSON-LD parseável, dimensões/alt, IDs e âncoras internas, sitemap/canonicals e robots.
- `tests/b2b.cjs`: **1.042 verificações** em larguras 320, 390, 768 e 1440 px. Verifica imagens carregadas, ausência de overflow e de erros JS/404 locais, menu/Escape/foco, diagnóstico obrigatório/voltar/todos os objetivos/tradução e URL do WhatsApp.
- Formulário: sucesso, erro remoto simulado, SDK ausente, exceção síncrona, timeout, duplicidade, preservação de campos, tipo no template atual e fallback. SDK mockado e endpoint real bloqueado; zero envio real.
- Privacidade: cinco eventos, ausência antes do consentimento, retirada, Global Privacy Control, exclusão de PII/UTMs arbitrárias e preservação de códigos aprovados. Storage bloqueado e JavaScript desativado também testados.
- axe-core 4.10.3, regras WCAG A/AA e boas práticas: **zero violações detectadas** nas seis páginas, viewport 390 px. Isso não substitui avaliação manual completa com tecnologia assistiva. Foco, labels, regiões de status e controles nativos foram revisados; não foi realizado teste humano com VoiceOver/NVDA.
- Capturas revisadas em `docs/evidence/`: home desktop/mobile, SaaS desktop e diagnóstico mobile. `git diff --check` sem erros ao concluir.

Os links públicos de Empreender 40+, GitHub, Native IP, StreetMe, TRUE e Instagram responderam HTTP 200. Turquesa retornou 406 em HEAD e GET; LinkedIn retornou 405/999. Esses dois links foram preservados e exigem checagem manual fora da automação; não há evidência suficiente para chamá-los de quebrados. O 404 da raiz `fonts.gstatic.com` no relatório bruto é um preconnect, não um link de navegação nem arquivo de fonte inexistente.

## Desempenho antes/depois

Edge/Chromium headless no mesmo computador, viewport 390 × 844, CPU 4× mais lenta, latência 100 ms, download 200.000 bytes/s, cache do navegador desativado, três navegações por versão. Medianas; os resultados brutos estão em `evidence/before.json` e `evidence/after.json`.

| Medida de laboratório | Antes | Depois |
| --- | ---: | ---: |
| LCP | 2.112 ms | 1.404 ms |
| FCP | 1.620 ms | 1.404 ms |
| CLS | 0,08110 | 0,00081 |
| Recursos locais transferidos na leitura inicial | 263.007 bytes | 181.031 bytes |
| Seis imagens substituídas, soma dos arquivos | 9.426.481 bytes | 248.794 bytes |

Melhorias observadas: logo menor no primeiro carregamento, derivados WebP abaixo da dobra e remoção do bloqueio visual de `.reveal` que ocultava conteúdo sem JS e atrasava o hero. Os originais permanecem disponíveis como fallback. Animações decorativas contínuas passaram a ter duração limitada. O resultado do diagnóstico respeita a navegação fixa ao receber foco; no celular, o botão flutuante foi ocultado para não encobrir os CTAs e controles. Os links de WhatsApp continuam no conteúdo.

Não são pontuações Lighthouse nem dados de campo. Não foi medido INP real. Fontes/CDNs e caches externos introduzem variação; a primeira execução de cada série foi mais lenta. O campo bruto `fullLocalBytes` não é comparável entre versões: lazy loading e rolagem suave afetaram o carregamento abaixo da dobra. Ele foi excluído da conclusão. A redução das imagens é medida diretamente nos arquivos, não estimada como economia em toda visita.

## Como repetir

Sem etapa de build ou testes preexistentes. Python padrão valida a estrutura; Node com Playwright executa o navegador. Não adicionamos dependências ao site público.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
python3 tests/check_site.py
# Em outro terminal, com Playwright instalado/disponível:
node tests/b2b.cjs
node tests/performance.cjs /tmp/gb-performance.json
```

Use `NODE_PATH` para o diretório de pacotes quando necessário, `BROWSER_PATH` para um Chromium/Edge instalado e `TEST_BASE_URL` para outra porta. Nesta máquina foi usado o Node/Playwright do runtime fornecido pelo Codex e `/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge`. `tests/b2b.cjs` grava capturas locais e não abre WhatsApp nem envia e-mails.

## Dados e validações pendentes antes de publicar

1. Autorização editorial de Native IP para a URL própria e confirmação do escopo individual; um case de construção da plataforma SaaS precisa de evidência adicional. Consulte `CASE-TEMPLATE.md`.
2. Provedor/ID de analytics, consentimento e códigos de campanha, conforme `ANALYTICS.md`. Até lá, nenhum evento sai do navegador.
3. Condições comerciais definitivas: titularidade/código, suporte, infraestrutura, prazos e orçamento. As páginas explicitam que dependem de proposta e escopo.
4. Homologação real do EmailJS somente com sua autorização e destinatário acordado; os testes desta entrega usam mocks.
5. Revisão humana de Turquesa/LinkedIn e teste com leitor de tela. Após um deploy autorizado, medir dados reais, acompanhar indexação e verificar as novas URLs públicas.

As métricas comerciais a acompanhar e suas limitações estão em `ANALYTICS.md`: cliques por intenção, conclusão do diagnóstico, contatos, qualificação, reuniões, propostas e contratos. Nenhuma melhoria de conversão foi presumida a partir dos testes locais.
