# ADR-003 - Adotar Fluent UI como Design System base da plataforma

## Status

Accepted

## Data

2026-10-24

## Contexto

A plataforma PingPong WebComponents tem como objetivo fornecer componentes reutilizáveis, consistentes e acessíveis para múltiplas aplicações consumidoras.

Além do comportamento funcional dos componentes, é necessário estabelecer um padrão visual que garanta:

- Consistência visual
- Acessibilidade
- Escalabilidade
- Reutilização
- Facilidade de manutenção
- Suporte a diferentes temas no futuro

Foi necessário definir uma estratégia de Design System para servir de base para todos os componentes da plataforma.

---

## Decisão

Adotar Fluent UI como Design System base da plataforma PingPong WebComponents.

A utilização do Fluent UI ocorrerá através de uma camada de abstração própria do PingPong, evitando dependência direta dos componentes com o framework visual adotado.

Os componentes da plataforma NÃO deverão consumir recursos do Fluent UI diretamente.

Todo acesso deverá ocorrer através da camada:

```text
design-system/
```

---

## Estratégia Arquitetural

### Princípio Fundamental

Os componentes pertencem ao PingPong.

O Design System é uma implementação substituível.

Portanto:

```text
Componente
      │
      ▼
PingPong Design System
      │
      ▼
Fluent Adapter
      │
      ▼
Fluent UI
```

E nunca:

```text
Componente
      │
      ▼
Fluent UI
```

---

## Motivações

### Consistência visual

Fluent UI fornece uma linguagem visual madura e amplamente utilizada.

Isso permite acelerar o desenvolvimento dos componentes iniciais da plataforma.

---

### Acessibilidade

Fluent UI possui forte preocupação com acessibilidade e padrões de experiência do usuário.

A adoção desses princípios reduz o esforço necessário para implementação dos componentes.

---

### Integração com Web Components

Fluent UI possui suporte ao ecossistema de Web Components, alinhando-se aos objetivos da plataforma.

---

### Evolução gradual

O uso de uma camada de abstração permite trocar o Design System no futuro sem impactar diretamente os componentes.

---

### Reutilização

Todos os componentes compartilharão:

- Cores
- Espaçamento
- Tipografia
- Motion
- Elevação
- Ícones
- Temas

através de contratos centralizados.

---

## Estratégia de Design Tokens

Os Design Tokens serão o contrato oficial da plataforma.

Nenhum componente deverá depender diretamente de tokens do Fluent UI.

Exemplo proibido:

```typescript
import {
  colorBrandBackground
} from "@fluentui/..."
```

Exemplo recomendado:

```typescript
import {
  colors
} from "@pingpong/design-system"
```

---

## Estrutura Definida

```text
design-system/

├── tokens
│
├── colors
│
├── spacing
│
├── typography
│
├── elevation
│
├── motion
│
├── icons
│
├── themes
│
└── fluent-adapter
```

---

## Estratégia de Temas

A plataforma deverá suportar múltiplos temas.

O suporte inicial deverá considerar:

### Theme Light

Tema padrão.

---

### Theme Dark

Tema escuro oficial.

---

### Temas Customizados

A arquitetura deverá permitir temas específicos por produto ou organização.

Exemplos:

- Portal RH
- Portal Financeiro
- Portal Marketing

---

### Racket Theme

Está prevista a criação futura de um Design System próprio denominado:

```text
Racket Theme
```

A existência da camada de abstração permitirá que o Racket Theme evolua sem obrigar alterações estruturais nos componentes existentes.

---

## Modelo de Componentes

A plataforma seguirá uma estratégia híbrida.

### Componentes próprios

Os componentes de negócio deverão ser criados pela plataforma PingPong.

Exemplos:

```html
<pp-popup></pp-popup>

<pp-questions></pp-questions>

<pp-banner></pp-banner>

<pp-feedback></pp-feedback>
```

---

### Fluent Components

Componentes Fluent poderão ser utilizados internamente quando fizer sentido técnico ou acelerar o desenvolvimento.

Nesses casos, o consumo deverá ocorrer através do Fluent Adapter.

---

## Alternativas Consideradas

### Criar Design System próprio desde o início

Descrição:

Desenvolver toda a linguagem visual do zero.

Motivo da rejeição:

Alto custo inicial de implementação e manutenção.

---

### Material Design

Descrição:

Utilização do ecossistema Material Design.

Motivo da rejeição:

Menor alinhamento com o contexto tecnológico atual da plataforma.

---

### Sem Design System

Descrição:

Cada componente possuir sua própria implementação visual.

Motivo da rejeição:

Elevado risco de inconsistência visual e crescimento descontrolado.

---

## Consequências

### Positivas

- Maior velocidade inicial de desenvolvimento
- Consistência visual
- Melhor acessibilidade
- Utilização de padrões consolidados
- Menor curva de entrada
- Evolução futura facilitada
- Possibilidade de criação do Racket Theme

### Negativas

- Dependência inicial do ecossistema Fluent UI
- Necessidade de manutenção da camada de abstração
- Curva de aprendizado dos Design Tokens

---

## Relação com Outros ADRs

Este ADR depende de:

- ADR-001 - C4 Model
- ADR-002 - Lit Element v3

Este ADR impacta:

- ADR-005 - Datadog
- Criação do pacote design-system
- Criação dos componentes da plataforma
- Estratégia de temas

---

## Observações

A camada de Design System pertence ao PingPong e não ao Fluent UI.

Fluent UI deve ser tratado como uma implementação do Design System e não como uma dependência arquitetural dos componentes.

Essa decisão garante liberdade tecnológica para a evolução futura da plataforma, incluindo a criação do Racket Theme como Design System proprietário.
