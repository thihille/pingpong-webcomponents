# ADR-004 - Adotar Fetch API nativa como base do HttpClient da plataforma

## Status

Accepted

## Data

2026-10-24

## Contexto

O projeto PingPong WebComponents tem como objetivo fornecer componentes reutilizáveis, independentes de framework, muitos dos quais precisam se comunicar com APIs externas para carregar ou enviar dados.

Foi necessário definir uma estratégia de comunicação HTTP que:

- Seja compatível com os padrões nativos da plataforma Web, alinhada à decisão do ADR-002
- Possua baixo impacto no bundle final dos consumidores
- Possua baixo acoplamento tecnológico
- Seja facilmente testável e substituível
- Permita tratamento padronizado de erros, timeout e cancelamento de requisições
- Esteja preparada para integração futura com observabilidade (ADR-005)

Foi necessária a definição da tecnologia base responsável pela comunicação HTTP dos Web Components da plataforma.

---

## Decisão

Adotar a Fetch API nativa do browser como tecnologia base para comunicação HTTP da plataforma PingPong.

O acesso à Fetch API não deverá ocorrer diretamente pelos componentes. Todo acesso deverá ocorrer através de uma camada de abstração própria:

```text
networking/
```

responsável por expor um `HttpClient` centralizado, consumido por todos os componentes da plataforma.

Os componentes da plataforma deverão suportar dois modos de montagem de dados, detalhados na seção **Estratégias de Montagem dos Componentes**.

---

## Estratégia Arquitetural

### Princípio Fundamental

Os componentes pertencem ao PingPong.

A tecnologia de comunicação HTTP é uma implementação substituível.

Portanto:

```text
Componente
      │
      ▼
PingPong HttpClient
      │
      ▼
Fetch API
```

E nunca:

```text
Componente
      │
      ▼
Fetch API
```

Esse princípio segue a mesma estratégia já adotada no ADR-003 para o Design System: o componente nunca deve depender diretamente da implementação concreta, apenas da camada de abstração da plataforma.

---

## Motivações

### Adoção de padrões nativos da Web

A Fetch API é um padrão nativo e amplamente suportado pelos browsers modernos.

Sua adoção reforça o alinhamento com a decisão do ADR-002, que prioriza o uso de padrões nativos da plataforma Web em detrimento de abstrações desnecessárias.

---

### Baixo tamanho de bundle

Por ser uma API nativa do browser, a Fetch API não adiciona nenhum peso ao bundle final dos componentes, ao contrário de bibliotecas como Axios.

Essa característica está diretamente alinhada ao objetivo de fornecer componentes leves, definido no ADR-002.

---

### Independência de Framework

Assim como os Web Components, a Fetch API funciona de forma nativa e independente de framework, reforçando o objetivo de interoperabilidade da plataforma entre diferentes ambientes consumidores.

---

### Preparação para observabilidade

A centralização das requisições HTTP em um `HttpClient` único cria o ponto de extensão necessário para integração futura com telemetria e monitoramento, tema do ADR-005.

---

## Convenções Definidas

### Camada de Networking

Toda comunicação HTTP deverá ocorrer através do pacote:

```text
networking/
```

Exemplo proibido:

```typescript
class PpFaq extends LitElement {
  async loadData() {
    const res = await fetch('https://api.com/faqs');
    // ...
  }
}
```

Exemplo recomendado:

```typescript
import { httpClient } from '@pingpong/networking';

class PpFaq extends LitElement {
  async loadData() {
    const data = await httpClient.get<FaqResponse>('/faqs');
    // ...
  }
}
```

### Funcionalidades obrigatórias do HttpClient

O `HttpClient` deverá oferecer, no mínimo:

- **Timeout configurável**, evitando que componentes fiquem aguardando respostas indefinidamente
- **Retry com backoff**, para resiliência a falhas transitórias de rede
- **Cancelamento de requisições**, via `AbortController`, essencial para componentes removidos do DOM durante uma requisição em andamento
- **Tratamento de erro padronizado**, unificando erros de rede, timeout e status HTTP em um formato consistente
- **Interceptors de request e response**, permitindo injeção de headers (autenticação, tracing) e captura de telemetria sem alterar os componentes consumidores
- **Tipagem via TypeScript genéricos**, em conformidade com o strict mode definido no ADR-002

---

## Estratégias de Montagem dos Componentes

Os componentes da plataforma PingPong deverão suportar dois modos distintos de obtenção e montagem de dados, dado que serão consumidos em diferentes jornadas do cliente (site, portal, área restrita, entre outras), com diferentes necessidades de integração.

### Modo 1 — Busca própria via parâmetro (self-fetch)

O componente recebe uma `string` via propriedade (ex: um identificador, chave ou token de referência).

Com base nesse parâmetro, o próprio componente, através do `HttpClient`, realiza a chamada ao backend da plataforma PingPong e monta seus dados a partir da resposta.

```typescript
import { httpClient } from '@pingpong/networking';

class PpFaq extends LitElement {
  @property({ type: String }) reference!: string;

  async connectedCallback() {
    super.connectedCallback();
    const data = await httpClient.get<FaqResponse>(`/faqs/${this.reference}`);
    this.data = data;
  }
}
```

```html
<pp-faq reference="abc123"></pp-faq>
```

Uso recomendado quando:

- O dado é fornecido pela própria API da plataforma PingPong (não pela API do consumidor)
- A aplicação consumidora não possui, ou não deseja implementar, a lógica de busca dos dados
- Deseja-se centralizar a regra de obtenção dos dados em um único lugar (a plataforma), facilitando evolução futura sem exigir mudanças nas aplicações consumidoras

Ponto de atenção: como a chamada ocorre a partir do domínio da aplicação consumidora, a API da plataforma PingPong deve estar preparada para lidar com múltiplas origens (CORS) e utilizar mecanismos de autenticação adequados à exposição pública no browser (ex: chaves públicas/escopadas), nunca credenciais sensíveis.

---

### Modo 2 — Payload fornecido pelo consumidor

O componente recebe diretamente um payload em formato JSON, via propriedade, já no formato esperado pelo componente.

Neste modo, a aplicação consumidora é responsável por obter os dados (de sua própria API, backend, SSR, cache, etc.) e fornecê-los prontos ao componente. O componente não realiza nenhuma chamada de rede, apenas monta a interface com base no payload recebido.

```typescript
class PpFaq extends LitElement {
  @property({ type: Object }) payload!: FaqResponse;

  render() {
    // monta o componente diretamente a partir de this.payload
  }
}
```

```html
<pp-faq .payload=${faqData}></pp-faq>
```

Uso recomendado quando:

- O dado vem de uma API própria da aplicação consumidora, e não da plataforma PingPong
- A aplicação consumidora já possui o dado disponível (SSR, estado já carregado, cache) e não há necessidade de nova chamada de rede
- Deseja-se evitar que o componente dependa de rede para renderizar, ou evitar os problemas de CORS/autenticação entre domínios, discutidos no Modo 1

---

### Resumo comparativo

| | Modo 1 — Self-fetch | Modo 2 — Payload fornecido |
|---|---|---|
| Origem dos dados | API da plataforma PingPong | API/backend da aplicação consumidora |
| Quem faz a chamada de rede | O componente, via `HttpClient` | A aplicação consumidora, fora do componente |
| Propriedade recebida | `string` (identificador/referência) | Objeto JSON já no formato esperado |
| Responsabilidade por CORS/auth | Plataforma PingPong | Aplicação consumidora (resolvido antes de chegar ao componente) |
| Dependência de rede no componente | Sim | Não |

Ambos os modos são suportados oficialmente pela plataforma. A escolha do modo é feita pela aplicação consumidora, conforme a origem dos dados necessários para aquele componente específico.

---

## Alternativas Consideradas

### Axios

#### Descrição:
Biblioteca popular para requisições HTTP, amplamente utilizada no ecossistema JavaScript.

#### Motivo da rejeição:
Adiciona peso desnecessário ao bundle final e introduz uma dependência externa para uma funcionalidade já resolvida de forma nativa pelo browser, contrariando o princípio de baixo acoplamento tecnológico definido no ADR-002.

---

### ky

#### Descrição:
Biblioteca leve, construída como wrapper sobre a Fetch API.

#### Motivo da rejeição:
Apesar do tamanho reduzido, ainda representa uma dependência externa não estritamente necessária, uma vez que a camada de abstração própria (`HttpClient`) já resolve as limitações de ergonomia da Fetch API nativa.

---

### XMLHttpRequest

#### Descrição:
API legada para requisições HTTP no browser.

#### Motivo da rejeição:
API mais verbosa e menos alinhada aos padrões modernos da Web, sem vantagens relevantes em relação à Fetch API para o contexto da plataforma.

<hr />

## Consequências Positivas

- Forte alinhamento com padrões Web nativos
- Zero impacto adicional no bundle final
- Baixo acoplamento tecnológico
- Facilidade de testes, através da substituição do `HttpClient` em ambientes de teste
- Ponto único de extensão para telemetria de rede (ADR-005)
- Tratamento de erro, timeout e cancelamento padronizados em toda a plataforma

## Considerações Negativas

- Necessidade de implementar manualmente funcionalidades que algumas bibliotecas oferecem prontas (retry, interceptors)
- Esforço inicial de desenvolvimento e manutenção da camada `networking/`
- Exige disciplina da equipe para nunca consumir a Fetch API diretamente nos componentes

---

## Relação com Outros ADRs

### Este ADR depende de:

- ADR-002 - Lit Element v3

### Este ADR impacta:

- ADR-005 - Datadog, através dos interceptors do `HttpClient`, possível ponto de captura de telemetria de rede
- Criação do pacote `networking/` e do `HttpClient`
- `BaseElement`, da camada Foundation, que deverá expor o acesso ao `HttpClient` de forma centralizada para os componentes

---

## Observações

A camada de `networking` pertence ao PingPong e não à Fetch API.

A Fetch API deve ser tratada como uma implementação do `HttpClient` e não como uma dependência arquitetural direta dos componentes.

Essa decisão garante liberdade tecnológica para evolução futura da estratégia de comunicação HTTP, sem exigir alterações nos componentes consumidores.

A convivência dos dois modos de montagem (self-fetch e payload fornecido) é intencional: a plataforma PingPong deve atender tanto aplicações que consomem dados próprios da plataforma quanto aplicações que já possuem seus próprios dados e apenas precisam renderizar o componente visualmente.
