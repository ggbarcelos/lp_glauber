# Formulário EmailJS existente

O site usa o SDK browser v4 e `emailjs.send()` em `js/main.js`. A chave pública continua no `index.html`; IDs do serviço/template continuam no JavaScript. Nenhum deles foi alterado nesta tarefa.

## Fluxo atual

- Nome, WhatsApp e contexto obrigatórios, com erros associados aos campos e foco no primeiro erro.
- Tipo de projeto opcional: enviado no início de `message`, para manter compatibilidade com o template existente.
- Confirmação acessível após sucesso; reset do formulário somente nesse caso.
- Rejeição, SDK ausente, erro síncrono ou ausência de resposta em 20 segundos: contexto preservado e links de WhatsApp/e-mail oferecidos. Nenhuma janela ou mensagem é aberta/enviada automaticamente.
- Um timeout significa que o envio não foi confirmado; o provedor ainda pode concluir a operação. O texto não afirma cancelamento.
- Sem JavaScript, o formulário permanece desabilitado para não transmitir campos pela URL. Os links de contato continuam disponíveis.
- Dados do formulário seguem somente para o EmailJS no envio solicitado pelo visitante; não entram em analytics, armazenamento local nem mensagens de erro de console.

## Verificação segura

Use `tests/b2b.cjs`, conforme `docs/B2B-VALIDACAO.md`. A suíte substitui o SDK por mocks e bloqueia requisições reais ao endpoint EmailJS. Não é necessário alterar credenciais ou o template para testar localmente.

Um envio real de homologação depende de autorização explícita do proprietário e destinatário combinado. Não foi realizado nesta tarefa.
