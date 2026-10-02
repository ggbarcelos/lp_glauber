# Identidade g. — arquivos finais

Proposta Portal: g de dois andares com curva inferior aberta, dentro de uma base azul com cantos arredondados e canto inferior direito diagonal. Ponto quadrado lima. Aplicação experimental no site; referência e versão anterior preservadas em creative/portal/.

## Arquivos separados

- `glauber-signature.svg`, `.png`, `.webp`: assinatura branca com ponto lima, para fundos escuros.
- `glauber-signature-dark.svg`, `.png`, `.webp`: assinatura grafite com ponto azul, para fundos claros.
- `glauber-symbol.svg`, `.png`, `.webp`: símbolo branco/lima sobre base azul Portal.
- `glauber-symbol-cyan.svg`, `.png`, `.webp`: variante Portal com base clara (nome legado do arquivo).
- `avatar-blue.png`: símbolo sobre fundo azul elétrico, 512 × 512.
- `icon-16.png`, `icon-32.png`, `icon-48.png`: favicons sobre fundo azul elétrico.
- `icon-180.png`: ícone Apple Touch.
- `icon-192.png`, `icon-512.png`: ícones grandes.
- `../../favicon.ico`: arquivo ICO com tamanhos 16, 32 e 48.

As assinaturas PNG/WebP têm 2400 × 800. Os símbolos PNG/WebP separados têm 2048 × 2048. As versões SVG usam contornos vetoriais: não dependem de fontes instaladas. As assinaturas e a área externa da base Portal têm transparência real.

## Produção

A exploração visual foi produzida com a ferramenta nativa de imagens. Os arquivos finais foram reconstruídos em vetor com um símbolo desenhado diretamente em caminhos vetoriais e assinatura tipográfica Sora, a tipografia do site. Isso evita as imperfeições da remoção de fundo nas tentativas de geração raster e mantém o mesmo desenho entre símbolo, assinatura e favicon.

O script `scripts/build-brand-assets.mjs` gera os contornos SVG e as exportações PNG/WebP/ICO. Recebe o diretório de dependências Node contendo `sharp` e `@napi-rs/canvas`. A fonte e sua licença estão em `img/fonts/`.

Paleta: grafite #101114, branco #EEF0E8, lima #D4FC68, azul #4667FF; alternativa ciano #55E6FF e violeta #9272FF.

## Refinamento do contorno

O g usa um único contorno contínuo, eliminando o degrau da sobreposição entre as curvas. O site prioriza SVG no cabeçalho e no rodapé; PNG/WebP são alternativas em alta resolução. Exportações raster renderizadas a partir do vetor em densidade ampliada. A versão anterior está preservada em `creative/portal/refinamento/antes/`.
