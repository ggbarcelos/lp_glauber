# Portfólio Profissional - Glauber

Uma landing page moderna, responsiva e profissional para apresentar o portfólio de um Engenheiro de Software Sênior.

## 🎯 Características

- ✨ **Design Moderno**: Interface limpa e profissional com gradientes dinâmicos
- 📱 **Totalmente Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- 🎨 **Paleta de Cores Moderna**: Azul, ciano e roxo com tema escuro sofisticado
- ⚡ **Animações Suaves**: Efeitos de entrada com AOS (Animate On Scroll)
- 🎭 **Interativo**: Filtros de projetos, formulário de contato e navegação suave
- 🚀 **Performance**: Código otimizado e bem estruturado
- ♿ **Semântico**: HTML5 semântico para melhor SEO e acessibilidade

## 📁 Estrutura de Arquivos

```
Portifolio/
├── index.html              # Arquivo HTML principal
├── css/
│   └── styles.css          # Estilos personalizados
├── js/
│   └── main.js             # Scripts JavaScript
├── img/
│   ├── glauber.jpeg        # Foto de perfil
│   ├── aplicativos/        # Imagens de projetos (aplicativos)
│   ├── landpages/          # Imagens de projetos (landing pages)
│   ├── portais/            # Imagens de projetos (portais)
│   └── saas/               # Imagens de projetos (SaaS)
└── README.md               # Este arquivo
```

## 🚀 Como Usar

### 1. Instalação Básica

Não há dependências de instalação. Basta abrir o arquivo `index.html` em um navegador moderno.

### 2. Personalização

#### Informações Pessoais
Edite o arquivo `index.html` e substitua:
- Nome: Procure por "Glauber" e substitua pelo seu nome
- E-mail: Procure por "contato@example.com" 
- Descrição: Atualize o texto das seções About, Skills e Projects

#### Imagens
1. **Foto de Perfil**: Coloque sua foto em `img/glauber.jpeg`
2. **Projetos**: Adicione as imagens dos projetos nas pastas correspondentes:
   - `img/aplicativos/app1.jpg`, `app2.jpg`, etc.
   - `img/landpages/landing1.jpg`, etc.
   - `img/portais/portal1.jpg`, etc.
   - `img/saas/saas1.jpg`, etc.

#### Cores (Tema)
Edite as variáveis CSS no topo do arquivo `css/styles.css`:
```css
:root {
    --primary-color: #0066ff;        /* Azul principal */
    --secondary-color: #00d4ff;      /* Ciano */
    --accent-color: #6610f2;         /* Roxo */
    --dark-bg: #0f1419;              /* Fundo escuro */
    --dark-surface: #1a1f2e;         /* Superfícies */
    --light-text: #ffffff;           /* Texto claro */
    --muted-text: #b0b8c1;           /* Texto suave */
}
```

### 3. Adicionar Projetos

No arquivo `index.html`, encontre a seção `<!-- Projects Grid -->` e adicione novos cards:

```html
<div class="project-card" data-category="aplicativos" data-aos="zoom-in">
    <div class="project-image-wrapper">
        <img src="img/aplicativos/app3.jpg" alt="Novo Projeto">
        <div class="project-overlay">
            <div class="project-actions">
                <a href="#" class="project-btn" title="Ver Projeto">
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    </div>
    <div class="project-content">
        <h3>Nome do Projeto</h3>
        <p>Descrição do projeto em 1-3 frases.</p>
        <div class="project-tech">
            <span class="tech-badge">Tecnologia 1</span>
            <span class="tech-badge">Tecnologia 2</span>
        </div>
    </div>
</div>
```

### 4. Links de Redes Sociais

Procure pelas seções de ícones sociais e atualize os URLs:
```html
<a href="https://github.com/seu-usuario" target="_blank">
<a href="https://linkedin.com/in/seu-perfil" target="_blank">
```

## 🎨 Seções da Página

### 1. **Navigation Bar**
- Navbar fixa com logo personalizado
- Links de navegação suave
- Responsiva com menu colapsável

### 2. **Hero Section**
- Apresentação principal com nome e subtítulo
- Foto de perfil destacada
- Botões de CTA
- Ícones de redes sociais
- Animações de fundo dinâmicas

### 3. **Sobre Mim**
- Texto descritivo
- Foto pessoal
- Lista de áreas de expertise

### 4. **Skills/Tecnologias**
- Três categorias: Frontend, Backend, DevOps & Tools
- Tags de tecnologias por categoria
- Efeito hover interativo

### 5. **Portfólio**
- Filtros por categoria (Todos, Aplicativos, Landing Pages, Portais, SaaS)
- Cards de projetos com imagens
- Overlay com link para ver projeto
- Badges de tecnologias
- Grid responsivo

### 6. **Contato**
- Formulário com validação
- Cards de contato (E-mail, Telefone, Localização)
- Integração com mailto

### 7. **Footer**
- Copyright
- Links de redes sociais
- Tema consistente

## 🔧 Dependências Externas

### CDN (já inclusos no HTML)
- **Bootstrap 4.5.2**: Framework responsivo
- **Font Awesome 6.0.0**: Ícones
- **Google Fonts**: Fontes Poppins e Inter
- **AOS 2.3.4**: Animações ao scroll
- **jQuery 3.5.1**: Dependência do Bootstrap
- **Popper.js 2.9.2**: Dependência do Bootstrap

## 📱 Responsividade

A página é otimizada para:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: até 767px

Breakpoints adicionais em `css/styles.css`:
- `768px`: Adaptações para tablet
- `576px`: Adaptações para mobile pequeno

## ✨ Animações

- **Fade-in & Slide-in**: Ao entrar na viewport
- **Hover Effects**: Em botões, cards e links
- **Parallax**: Efeito de fundo na hero section
- **Glow Effect**: Nos elementos destacados

## 🔐 Segurança

- Formulário de contato com validação
- Sem armazenamento de dados sensíveis
- Uso de mailto para envio de e-mails

## 🌐 Compatibilidade

Testado e funcional em:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📈 SEO

- HTML semântico
- Meta tags apropriadas
- Estrutura hierárquica clara
- Alt text em imagens

## 🎯 Dicas de Personalização

1. **Mudar o tema de cores**: Edite as variáveis CSS em `:root`
2. **Adicionar mais skills**: Duplique um card de skill e customize
3. **Aumentar quantidade de projetos**: Adicione novos cards no grid
4. **Integrar com backend**: Substitua a funcionalidade do formulário por uma chamada AJAX
5. **Adicionar mais seções**: Use a mesma estrutura de grid responsivo

## 📝 Notas Importantes

- Substitua as imagens placeholder pelas suas imagens reais
- Atualize todos os dados pessoais (nome, e-mail, links sociais)
- Teste a responsividade em dispositivos reais
- Verifique os links para as redes sociais
- Customize as cores conforme sua marca pessoal

## 🚀 Deploy

### Google Analytics 4

1. No Google Analytics, crie ou selecione a propriedade e o fluxo Web de `https://glauberbarcelos.com.br` em **Administrador → Fluxos de dados**.
2. Copie o **ID de medição** (`G-XXXXXXXXXX`) para `googleMeasurementId` em `js/analytics-config.js`. O ID é público; não use uma chave de API.
3. Publique os arquivos no GitHub Pages. Todas as seis páginas carregam a integração compartilhada.
4. Abra o site, aceite a análise no aviso de privacidade e confira **Relatórios → Tempo real**. Sem consentimento, com recusa ou com sinal de não rastreamento do navegador, a tag não é carregada.

São enviados `page_view`, `cta_click`, `whatsapp_click`, `diagnostic_start`, `diagnostic_complete` e `form_submit_success`. Os eventos de interação usam os parâmetros `page`, `origin` e `project_type`; cadastre dimensões personalizadas com escopo de evento para consultá-los nos relatórios. Para medir contatos como resultados, marque `form_submit_success` e/ou `whatsapp_click` como eventos principais no painel do GA4.

Os campos do formulário e do diagnóstico não são enviados pela integração. URLs enviadas excluem query strings e fragmentos; UTMs personalizadas só são enviadas quando os códigos estão na lista `campaigns` da configuração. Revogar o consentimento recarrega a página para interromper a tag. Um ID vazio mantém esse provedor desativado. Microsoft Clarity continua opcional, com configuração independente.

Referências: [instalação da tag](https://developers.google.com/tag-platform/gtagjs), [consentimento](https://developers.google.com/tag-platform/security/guides/consent).

A página está pronta para ser deployada em qualquer hosting estático:
- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront
- Qualquer servidor web

## 📞 Suporte

Para dúvidas ou melhorias, consulte a documentação oficial de:
- [Bootstrap](https://getbootstrap.com/)
- [Font Awesome](https://fontawesome.com/)
- [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/)

---

Desenvolvido com ❤️ para apresentar seu portfólio profissional de forma moderna e impactante!
