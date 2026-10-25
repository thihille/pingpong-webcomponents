# C4 Model — Nível 3: Component

> Referência: ADR-001 (adoção do C4 Model), nível obrigatório.

## Visão Geral

Este nível faz o zoom-in **dentro** de cada container definido em `c4-container.md`, detalhando seus principais blocos internos e responsabilidades. Nem todo container precisa de um diagrama de componentes — aqui estão detalhados os três containers com complexidade suficiente para justificar o detalhamento: `foundation`, `networking` e `components`. Os containers `design-system` e `telemetry` podem ser detalhados aqui futuramente, se e quando a complexidade interna justificar.

---

## Container: `foundation`

```mermaid
C4Component
    title Componentes - Container "foundation"

    Container_Boundary(foundation, "foundation") {
        Component(baseElement, "BaseElement", "Lit Element base class", "Classe base herdada por todos os componentes pp-*")
        Component(payloadValidator, "Payload Validator", "TypeScript", "Valida o payload recebido (Modo 2) contra o schema esperado pelo componente")
        Component(errorBoundary, "Error Boundary", "TypeScript", "Captura erros não tratados e falhas de validação. Decide o fallback visual")
    }

    Container(networking, "networking", "HttpClient")
    Container(telemetry, "telemetry", "Telemetry SDK")

    Rel(baseElement, payloadValidator, "Valida payload recebido (Modo 2)")
    Rel(payloadValidator, errorBoundary, "Reporta falha de validação")
    Rel(baseElement, networking, "Usa, quando componente está em Modo 1 (self-fetch)")
    Rel(errorBoundary, telemetry, "Loga erro, sempre")
    Rel(baseElement, telemetry, "Loga performance de renderização e eventos")
```

**Responsabilidades:**
- `BaseElement`: ponto de herança único de todos os componentes (ADR-002). É quem decide, com base no que o componente recebe, se está em Modo 1 (self-fetch) ou Modo 2 (payload fornecido) (ADR-004).
- `Payload Validator`: valida o schema do payload recebido no Modo 2, antes da renderização (ADR-005).
- `Error Boundary`: centraliza a captura de erro — payload inválido, exceção não tratada — decidindo entre renderizar um fallback visível ou suprimir a renderização, conforme a criticidade do componente (ADR-005).

---

## Container: `networking`

```mermaid
C4Component
    title Componentes - Container "networking"

    Container_Boundary(networking, "networking") {
        Component(httpClient, "HttpClient", "TypeScript", "Fachada pública, consumida pelos componentes via BaseElement")
        Component(interceptors, "Interceptors", "TypeScript", "Pipeline de request/response: headers, tracing, captura de telemetria de rede")
        Component(retryHandler, "Retry Handler", "TypeScript", "Lógica de retry com backoff para falhas transitórias")
        Component(fetchAdapter, "Fetch Adapter", "TypeScript", "Wrapper fino sobre a Fetch API nativa: timeout, AbortController, parsing")
    }

    System_Ext(fetchApi, "Fetch API", "Nativa do browser")
    Container(telemetry, "telemetry")

    Rel(httpClient, interceptors, "Passa a requisição por")
    Rel(interceptors, retryHandler, "Aciona retry quando necessário")
    Rel(retryHandler, fetchAdapter, "Executa a chamada via")
    Rel(fetchAdapter, fetchApi, "Usa")
    Rel(interceptors, telemetry, "Reporta erro/latência de rede (Modo 1)")
```

**Responsabilidades:**
- `HttpClient`: única API pública exposta aos componentes (ADR-004).
- `Interceptors`: ponto de extensão para autenticação, tracing e telemetria, sem alterar os componentes consumidores.
- `Retry Handler`: resiliência a falhas transitórias, com backoff configurável.
- `Fetch Adapter`: isola o uso direto da Fetch API nativa, concentrando timeout e cancelamento via `AbortController`.

---

## Container: `components`

```mermaid
C4Component
    title Componentes - Container "components"

    Container_Boundary(components, "components") {
        Component(ppPopup, "pp-popup", "Lit Element")
        Component(ppButton, "pp-button", "Lit Element")
        Component(ppCard, "pp-card", "Lit Element")
        Component(ppFaq, "pp-faq", "Lit Element")
        Component(ppQuestions, "pp-questions", "Lit Element")
        Component(ppBanner, "pp-banner", "Lit Element")
        Component(ppFeedback, "pp-feedback", "Lit Element")
    }

    Container(foundation, "foundation", "BaseElement")
    Container(designSystem, "design-system")

    Rel(ppPopup, foundation, "extends")
    Rel(ppButton, foundation, "extends")
    Rel(ppCard, foundation, "extends")
    Rel(ppFaq, foundation, "extends")
    Rel(ppQuestions, foundation, "extends")
    Rel(ppBanner, foundation, "extends")
    Rel(ppFeedback, foundation, "extends")
    Rel(ppPopup, designSystem, "Usa tokens e temas")
    Rel(ppFaq, designSystem, "Usa tokens e temas")
```

**Responsabilidades:**
- Cada `pp-*` é um Custom Element independente, que herda de `BaseElement` e não implementa lógica própria de fetch, validação ou telemetria — tudo isso é resolvido pela camada `foundation` (ADR-002, ADR-005).
- A lista de componentes aqui reflete os exemplos já citados nos ADR-002 e ADR-003. Conforme novos componentes forem criados (ver `ROADMAP-V1.md`, fase *Components Phase*), este diagrama deve ser atualizado.

---

## Observações

- Este nível é o que mais vai mudar com o tempo — à medida que novos componentes, interceptors ou validadores forem adicionados, os diagramas aqui devem ser atualizados para refletir a realidade do código (Princípio 3 do ADR-001).
- Os containers `design-system` e `telemetry` não têm diagrama de componentes ainda porque sua estrutura interna (tokens, fluent-adapter / RUM, error tracking, logs) está suficientemente descrita nos próprios ADR-003 e ADR-005. Criar esse detalhamento aqui só se a complexidade interna justificar.
