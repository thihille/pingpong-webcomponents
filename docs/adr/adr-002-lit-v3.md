# ADR-002 - Adotar Lit Element v3 como base tecnológica para os Web Components

## Status

Accepted

## Data

2026-10-24

## Contexto

O projeto PingPong WebComponents tem como objetivo fornecer uma plataforma de componentes reutilizáveis, independentes de framework, distribuídos através de pacotes compartilhados e consumidos por múltiplas aplicações.

Os componentes deverão:

- Seguir os padrões nativos da plataforma Web
- Possuir baixo acoplamento tecnológico
- Ser compatíveis com diferentes ecossistemas frontend
- Ser facilmente distribuídos via NPM
- Possuir boa integração com TypeScript
- Oferecer alto desempenho de renderização
- Possuir baixo impacto no bundle final dos consumidores
- Integrar-se adequadamente com Fluent UI
- Evoluir para uma biblioteca potencialmente Open Source

Foi necessária a definição da tecnologia base responsável pela implementação dos Web Components da plataforma.

---

## Decisão

Adotar Lit Element v3 como tecnologia oficial para o desenvolvimento de todos os Web Components da plataforma PingPong.

Todos os componentes deverão ser desenvolvidos utilizando:

- Lit Element v3
- Custom Elements
- Shadow DOM
- TypeScript

---

## Motivações

### Adoção de padrões nativos da Web

Lit é construído sobre os padrões oficiais da plataforma Web.

A biblioteca complementa os recursos nativos sem abstrair excessivamente o funcionamento dos Web Components.

---

### Independência de Framework

Os componentes produzidos pela plataforma deverão funcionar em diferentes ambientes:

- HTML puro
- React
- Angular
- Vue
- Micro Frontends
- Aplicações corporativas legadas

A utilização de Web Components permite essa interoperabilidade.

---

### Baixo tamanho de bundle

Um dos objetivos do projeto é fornecer componentes leves e reutilizáveis.

Lit apresenta footprint reduzido quando comparado a alternativas mais completas de frontend.

---

### Performance

Lit utiliza renderização eficiente baseada em templates reativos.

Essa abordagem reduz atualizações desnecessárias do DOM e favorece componentes reutilizáveis distribuídos em larga escala.

---

### Integração com TypeScript

TypeScript será utilizado em modo estrito (strict mode) para garantir:

- Maior previsibilidade
- Melhor experiência de desenvolvimento
- Redução de erros em tempo de execução
- APIs mais bem definidas

---

### Alinhamento Profissional

Lit também é utilizado em iniciativas profissionais do mantenedor do projeto.

A adoção da mesma tecnologia permite:

- Compartilhamento de conhecimento
- Reaproveitamento de padrões arquiteturais
- Evolução técnica mais consistente
- Menor curva de aprendizado

---

### Integração com Fluent UI

A plataforma utilizará Fluent UI como Design System base.

Lit possui excelente alinhamento com ecossistemas orientados a Web Components e favorece a integração com design systems modernos.

---

## Convenções Definidas

### Nomenclatura dos componentes

Os componentes utilizarão o prefixo:

```html
    <pp-*>
    <pp-popup></pp-popup>
    <pp-button></pp-button>
    <pp-card theme="dark"></pp-card>
    <pp-faq></pp-faq>
    <pp-questions></pp-questions>
```

O prefixo pp representa a identidade da plataforma PingPong.

### TypeScript

Todos os pacotes desenvolvidos pela plataforma deverão utilizar:

```json
{
  "strict": true
}
```
como configuração obrigatória.

## Alternativas Consideradas

### Stencil

#### Descrição:
Framework especializado para criação de Web Components.

#### Pontos positivos:
- Excelente experiência de desenvolvimento
- Estrutura opinativa
- Geração automática de wrappers para frameworks
- Ótimo suporte corporativo

#### Motivo da rejeição:
Apesar da experiência prévia positiva com Stencil, a adoção de Lit oferece melhor alinhamento com os objetivos atuais da plataforma e com o ecossistema utilizado profissionalmente pelo mantenedor.

### React

#### Descrição:
Biblioteca amplamente utilizada para construção de interfaces.

#### Motivo da rejeição:
O objetivo da plataforma é produzir Web Components independentes de framework.

### Angular Elements

#### Descrição:
Abordagem baseada no ecossistema Angular.

#### Motivo da rejeição:
Maior complexidade e acoplamento tecnológico.

### Vue

#### Descrição:
Framework progressivo para interfaces web.

#### Motivo da rejeição:
Não atende ao requisito principal de fornecer uma camada neutra para distribuição de Web Components.

<hr />

## Consequências Positivas
- Forte alinhamento com padrões Web
- Componentes framework-agnostic
- Excelente integração com TypeScript
- Fácil distribuição via NPM
- Boa performance
- Baixo tamanho de bundle
- Curva de manutenção reduzida
- Facilidade de integração com diferentes aplicações consumidoras

## Considerações Negativas
- Menor ecossistema quando comparado a React
- Necessidade de conhecimento sobre Web Components
- Alguns frameworks exigem configurações específicas para integração

---

## Relação com Outros ADRs

### Este ADR depende de:

ADR-001 - C4 Model

### Este ADR impacta:

- ADR-003 - Fluent UI
- ADR-004 - Fetch API
- ADR-005 - Datadog

---

## Observações

Todos os componentes da plataforma PingPong deverão herdar de uma implementação comum baseada em BaseElement, definida na camada Foundation.
A adoção do Lit Element v3 estabelece a base tecnológica principal da plataforma.
