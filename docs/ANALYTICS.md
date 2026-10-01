# Microsoft Clarity, eventos B2B e privacidade

O site integra o Microsoft Clarity pelas APIs `identify`, `set`, `event` e `consentv2`. A configuração fica em `js/analytics-config.js`. Enquanto `clarityProjectId` estiver vazio, nenhum SDK de analytics é carregado e a interface de consentimento não aparece.

## Ativação

1. Copie o ID em Clarity → Settings → Setup → Installation para `clarityProjectId`. Mantenha `enabled: true`.
2. No projeto Clarity, habilite Consent Mode (desative cookies por padrão em Settings → Setup). A interface do site solicita consentimento para analytics; armazenamento para publicidade permanece `denied`.
3. Configure o mascaramento do projeto como **Strict**. O formulário de contato e toda a seção de diagnóstico também usam `data-clarity-mask="true"`.
4. Preencha as listas de campanhas somente com códigos públicos aprovados. Listas vazias continuam válidas e não enviam UTMs nos eventos personalizados.

A integração é compartilhada pelas seis páginas e só solicita `https://www.clarity.ms/tag/ID` depois de uma escolha afirmativa do visitante. Recusa, Do Not Track e Global Privacy Control impedem o carregamento. A escolha fica em `gb_analytics_consent` no localStorage, e pode ser alterada pelo botão “Preferências de privacidade” no rodapé. Retirada de consentimento limpa os IDs próprios, envia `consentv2` com ambos os tipos de armazenamento negados e recarrega a página sem o SDK. Isso também interrompe a gravação sem cookies que o ConsentV2 isolado permitiria. Não há fila de interações anteriores ao consentimento. Outras abas abertas recebem a retirada pelo evento `storage`.

Sem acesso ao storage, a escolha e os IDs valem apenas para a página atual; o restante do site continua funcionando. Sem JavaScript, o Clarity não é carregado.

## Identificadores personalizados

A cada página consentida, a integração chama:

```js
window.clarity('identify', visitorId, sessionId, page);
```

- `visitorId`: ID aleatório de 128 bits com prefixo `gbv_`, salvo em `gb_clarity_visitor` no localStorage após consentimento. Permanece entre visitas no mesmo navegador até retirada da escolha ou limpeza de dados.
- `sessionId`: ID aleatório de 128 bits com prefixo `gbs_`, salvo em `gb_clarity_session` no sessionStorage. Acompanha navegação e recargas na mesma aba; não corresponde necessariamente à duração de sessão calculada pelo Clarity.
- `page`: nome aprovado do arquivo HTML; `/` usa `index.html`, caminhos desconhecidos usam `other`. Query string e hash não entram nesse ID.
- `friendly-name`: omitido. Nome, telefone e mensagem do formulário não são usados como identificadores. Como não há login, os IDs não correlacionam uma pessoa entre dispositivos.

Os eventos passam pelo filtro existente em `GBAnalytics` e chegam ao Clarity como `event`, com tags `page`, `origin`, `project_type` e UTMs aprovadas. O contrato abaixo descreve **apenas nossas chamadas personalizadas**: o SDK do Clarity também coleta navegação, URLs, referrer, interações e informações do dispositivo para suas gravações e mapas de calor. Não coloque dados pessoais em URLs. As listas de UTMs não filtram os metadados coletados automaticamente pelo SDK.

Para integração com outro gestor de consentimento, use `GBAnalytics.setConsent(true)` após aceite e `GBAnalytics.setConsent(false)` ao retirar a escolha. A retirada de uma sessão ativa recarrega a página.

Referências oficiais: [Identify API](https://learn.microsoft.com/en-us/clarity/setup-and-installation/identify-api), [Client API](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-api), [ConsentV2](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2).

## Contrato fechado

| Campo | Valores |
| --- | --- |
| `event` | `cta_click`, `diagnostic_start`, `diagnostic_complete`, `whatsapp_click`, `form_submit_success` |
| `page` | Um dos seis nomes de páginas conhecidas; caminhos desconhecidos viram `other` |
| `origin` | `hero`, `navigation`, `services`, `cases`, `diagnostic`, `contact`, `floating`, `footer`, `content` |
| `type` | `saas`, `app`, `architecture`, `ai`, `web`, `consulting`, `unspecified` |
| UTMs opcionais | Somente correspondência exata com códigos previamente aprovados |

Nunca entram nome, telefone, mensagem, respostas de estágio/usuários/obstáculo, URL completa, query arbitrária, hash, referrer ou texto do WhatsApp. `utm_term` e `utm_content` são ignorados. UTMs aprovadas são preservadas entre páginas internas e nos eventos, nunca anexadas ao WhatsApp ou EmailJS. A comparação exata é necessária porque mesmo um slug aparentemente válido pode conter informação pessoal.

`diagnostic_start` ocorre ao iniciar; `diagnostic_complete` uma vez por abertura da página, na primeira conclusão. Revisar respostas não aumenta conclusões. `form_submit_success` exige resolução bem-sucedida do EmailJS. Cliques em CTAs de WhatsApp podem gerar os dois eventos de clique, intencionalmente. Esses eventos não comprovam que uma mensagem foi enviada no WhatsApp nem que o lead é qualificado.

## Métricas a acompanhar após a ativação

- Cliques de SaaS, app e consultoria por página/origem/campanha.
- Conclusões ÷ inícios do diagnóstico, dentro da mesma janela e população consentida.
- Cliques de WhatsApp originados no diagnóstico e formulário concluído por tipo de projeto.
- Falhas e desempenho do formulário em monitoramento técnico, sem conteúdo das mensagens.
- Contatos qualificados, reuniões, propostas e contratos em registro comercial separado. Definir qualificado como problema/objetivo claro, aderência ao serviço, responsável pela decisão e próximo passo viável; não enviar esse registro pessoal ao analytics.
- Core Web Vitals em dados de campo (LCP, INP, CLS) e indexação das novas URLs no Search Console após uma publicação autorizada.

Os identificadores e pageviews do Clarity permitem acompanhar jornadas no tráfego consentido. Cliques e eventos isolados não comprovam contato, qualificação ou venda. Percentuais representam apenas o tráfego que consentiu.

## Verificação local

Com o servidor estático rodando e Playwright disponível:

```bash
TEST_BASE_URL=http://127.0.0.1:8000 node tests/clarity.cjs
```

Use `NODE_PATH` e `BROWSER_PATH` conforme `docs/B2B-VALIDACAO.md`. O teste injeta um ID fictício somente na resposta local e simula o SDK: não envia eventos, gravações ou e-mails reais. Cobre as seis páginas, IDs estáveis, consentimento e retirada durante carregamento, sinais de privacidade, eventos filtrados, storage bloqueado e falhas do SDK. A conexão real ao painel precisa ser conferida depois de preencher o ID e publicar.
