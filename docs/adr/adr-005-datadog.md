# ADR-005 - Adotar Datadog como ferramenta de observabilidade da plataforma

## Status

Accepted

## Data

2026-10-24

## Contexto

A plataforma PingPong WebComponents será consumida por múltiplas aplicações, em diferentes jornadas do cliente (site, portal, área restrita, entre outras).

Por se tratar de componentes reutilizáveis distribuídos em larga escala, é necessário possuir visibilidade sobre:

- Performance de carregamento e renderização dos componentes
- Erros não tratados em tempo de execução
- Eventos relevantes de negócio ocorridos dentro dos componentes
- Falhas de comunicação de rede, complementando o `HttpClient` definido no ADR-004

Foi necessário definir uma estratégia de observabilidade escalável, capaz de acompanhar o crescimento da plataforma e o aumento do número de aplicações consumidoras, sem comprometer performance nem gerar acoplamento direto entre os componentes e a ferramenta de monitoramento escolhida.

---

## Decisão

Adotar Datadog como ferramenta oficial de observabilidade da plataforma PingPong WebComponents.

O escopo inicial de utilização cobre três frentes:

- **RUM (Real User Monitoring)**: performance de carregamento e interação dos componentes
- **Error Tracking**: captura de exceções e erros não tratados em tempo de execução
- **Logs customizados**: registro de eventos de negócio relevantes ocorridos dentro dos componentes

O acesso ao Datadog não deverá ocorrer diretamente pelos componentes. Todo acesso deverá ocorrer através de uma camada de abstração própria:

```text
telemetry/
```

responsável por expor um Telemetry SDK centralizado, consumido por todos os componentes da plataforma.

---

## Estratégia Arquitetural

### Princípio Fundamental

Os componentes pertencem ao PingPong.

A ferramenta de observabilidade é uma implementação substituível.

Portanto:

```text
Componente
      │
      ▼
PingPong Telemetry SDK
      │
      ▼
Datadog Adapter
      │
      ▼
Datadog
```

E nunca:

```text
Componente
      │
      ▼
Datadog
```

Esse princípio segue a mesma estratégia já adotada no ADR-003 (Fluent Adapter) e no ADR-004 (Fetch API): o componente nunca deve depender diretamente da implementação concreta, apenas da camada de abstração da plataforma.

---

## Motivações

### Alinhamento Profissional

Datadog é utilizado em iniciativas profissionais do mantenedor do projeto.

A adoção da mesma ferramenta permite:

- Compartilhamento de conhecimento
- Reaproveitamento de padrões de observabilidade
- Evolução técnica mais consistente
- Menor curva de aprendizado

A decisão foi tomada de forma direta, sem comparação formal com outras ferramentas de observabilidade, dado o alinhamento profissional já existente do mantenedor com o Datadog.

---

### Centralização via BaseElement

Todos os componentes da plataforma herdam de `BaseElement`, definido na camada Foundation (ADR-002).

Não há, até o momento, nenhum caso mapeado de componente que não passe por essa camada. Isso torna o `BaseElement` o ponto de centralização ideal para captura automática de telemetria — erros não tratados, performance de renderização e falhas no tratamento dos dados recebidos — sem exigir que cada componente implemente isso manualmente.

---

### Complementaridade com o HttpClient

O ADR-004 define dois modos de montagem dos componentes: Modo 1 (self-fetch, via `HttpClient`) e Modo 2 (payload fornecido diretamente pelo consumidor). A captura de telemetria se aplica de forma diferente em cada um:

- **Modo 1 (self-fetch)**: o `HttpClient` expõe interceptors de request e response. Esses interceptors são o ponto natural de captura de telemetria de rede (latência, falhas, status de erro), permitindo que falhas de comunicação sejam automaticamente refletidas no Datadog sem alterar os componentes consumidores.
- **Modo 2 (payload fornecido)**: não há chamada de rede feita pelo componente, portanto não se aplica telemetria de rede. Nesse modo, a captura relevante é a de **validação do payload recebido**, detalhada a seguir.

---

### Validação de Payload e Tratamento de Erro (Modo 2)

No Modo 2 (payload fornecido pelo consumidor), o componente depende inteiramente do formato de dado enviado pela aplicação consumidora. É possível que o payload recebido não corresponda ao schema esperado pelo componente (campo ausente, tipo incorreto, payload de outro componente, etc.).

Nesses casos, o `BaseElement` deverá:

1. **Validar o payload recebido** contra o schema esperado pelo componente antes de montar a interface.
2. **Registrar o erro no Datadog**, sempre, via Telemetry SDK, com detalhes estruturados: nome do componente, payload recebido (ou um resumo seguro dele, evitando dados sensíveis), e os campos esperados que não foram atendidos.
3. **Renderizar um estado de erro visível ao usuário**, por padrão, em vez de deixar o componente ausente (não renderizado) na tela.

A opção por renderizar um fallback de erro, em vez de simplesmente não renderizar nada, se justifica por dois motivos: evita que o componente "desapareça" silenciosamente da jornada do cliente sem explicação, e acelera a identificação do problema de integração pelo time responsável.

Componentes que, por critério de negócio, não devam renderizar nenhum conteúdo em caso de payload inválido (ex: componentes críticos, como os relacionados a pagamento) podem sobrescrever esse comportamento padrão, desde que o registro do erro no Datadog continue ocorrendo normalmente.

---

### Escalabilidade

A centralização da observabilidade em um Telemetry SDK único, com camada de abstração, permite que a estratégia evolua (troca de ferramenta, ajuste de volume de dados, mudança de critérios de captura) sem exigir alterações nos componentes já distribuídos.

---

## Convenções Definidas

### Camada de Telemetry

Toda comunicação com o Datadog deverá ocorrer através do pacote:

```text
telemetry/
```

Exemplo proibido:

```typescript
import { datadogRum } from '@datadog/browser-rum';

class PpFaq extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    datadogRum.addAction('faq_opened');
  }
}
```

Exemplo recomendado:

```typescript
import { telemetry } from '@pingpong/telemetry';

class PpFaq extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    telemetry.log('faq_opened');
  }
}
```

### Funcionalidades previstas do Telemetry SDK

O Telemetry SDK deverá oferecer:

- **Captura automática de erros não tratados**, centralizada via `BaseElement`
- **Captura automática de erros de validação de payload** (Modo 2, conforme ADR-004), incluindo o schema esperado e o payload recebido
- **API de log manual** para eventos de negócio (`telemetry.log(...)`)
- **Captura de métricas de performance**, incluindo tempo de renderização dos componentes e, via integração com os interceptors do `HttpClient`, tempo de resposta de rede
- **Sampling configurável** (planejado): necessário para controlar volume de dados enviados em produção com alto tráfego, evitando custo e ruído desnecessários
- **Habilitação por ambiente** (planejado): telemetria deverá poder ser desabilitada em ambientes de desenvolvimento e teste, evitando o envio de dados não representativos ao Datadog real

As funcionalidades marcadas como planejadas serão detalhadas e implementadas de forma incremental, à medida que o time aprofundar o conhecimento sobre os recursos do Datadog.

---

## Alternativas Consideradas

### Nenhuma alternativa formalmente avaliada

A decisão por Datadog foi tomada de forma direta, sem comparação com outras ferramentas (como Sentry, New Relic ou Application Insights), em função do alinhamento profissional já existente do mantenedor com a ferramenta.

<hr />

## Consequências Positivas

- Visibilidade centralizada sobre erros, performance e eventos de negócio
- Reaproveitamento de conhecimento profissional já existente do mantenedor
- Captura automática via `BaseElement`, sem esforço adicional por componente
- Integração natural com o `HttpClient` (ADR-004) para telemetria de rede
- Estratégia preparada para escalar com o crescimento da plataforma, através de sampling e controle por ambiente

## Considerações Negativas

- Ausência de comparação formal com outras ferramentas de observabilidade
- Conhecimento ainda em desenvolvimento sobre funcionalidades avançadas do Datadog por parte do time
- Necessidade de manutenção da camada de abstração `telemetry/`
- Sampling e habilitação por ambiente ainda não implementados, apenas planejados

---

## Relação com Outros ADRs

### Este ADR depende de:

- ADR-002 - Lit Element v3
- ADR-004 - Fetch API

### Este ADR impacta:

- Criação do pacote `telemetry/` e do Telemetry SDK
- `BaseElement`, da camada Foundation, como ponto central de captura automática de telemetria

---

## Observações

A camada de `telemetry` pertence ao PingPong e não ao Datadog.

Datadog deve ser tratado como uma implementação do Telemetry SDK e não como uma dependência arquitetural direta dos componentes.

Essa decisão garante liberdade tecnológica para evolução futura da estratégia de observabilidade, incluindo eventual troca ou uso combinado de ferramentas, sem exigir alterações nos componentes consumidores.
