# Eventos B2B e privacidade

Nenhuma ferramenta de analytics estava instalada no código inspecionado. A integração está **desativada** em `js/analytics-config.js`; não carrega SDK, cookie, pixel ou endpoint de analytics.

## Dados necessários para ativar

1. Provedor, identificador da propriedade/site e forma de receber eventos.
2. Política e interface de consentimento aprovada, inclusive retirada do consentimento.
3. Códigos públicos e não pessoais permitidos para `utm_source`, `utm_medium` e `utm_campaign`.
4. Responsável por retenção, acesso aos relatórios e política de privacidade do provedor.

Configure `enabled`, `send(payload)` e as listas de campanhas. O provedor deve ser carregado **somente após consentimento**, sem coleta automática de páginas, URLs, referrer, formulários, IP persistente ou identificadores. Revise também a configuração do provedor: o filtro do site não controla dados que um SDK colete por conta própria.

```js
// Exemplo de contrato; não há endpoint configurado no site.
window.GB_ANALYTICS_CONFIG = {
  enabled: true,
  campaigns: {
    utm_source: ['linkedin'],
    utm_medium: ['organic', 'cpc'],
    utm_campaign: ['saas_b2b']
  },
  send(payload) {
    // Encaminhar apenas payload ao adaptador aprovado.
  }
};
// Após a escolha explícita do visitante:
window.GBAnalytics.setConsent(true);
// Ao retirar a escolha, desativar também qualquer SDK externo:
window.GBAnalytics.setConsent(false);
```

O sinal Do Not Track e o Global Privacy Control impedem a coleta. Não há fila de eventos anteriores ao consentimento, persistência de respostas, identificador de visitante ou coleta de texto livre.

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

Não calcular conversão por visitante com estes eventos isolados: não há pageviews nem identificadores. Percentuais representam apenas o tráfego que consentiu.
