# ADR-001 - Adotar o C4 Model como notação oficial de documentação arquitetural

## Status

Accepted

## Data

2026-10-24

## Contexto

Neste momento, a plataforma possui um único mantenedor responsável pelas decisões arquiteturais e evolução técnica do projeto.

O projeto nasce como uma iniciativa individual com potencial de evolução para um ecossistema colaborativo e Open Source. Por esse motivo, as decisões arquiteturais devem priorizar:

- Simplicidade inicial
- Baixo acoplamento
- Clareza documental
- Evolução incremental
- Facilidade de onboarding para futuros contribuidores

A documentação arquitetural deverá servir como mecanismo principal de preservação do conhecimento, permitindo que futuras contribuições sejam realizadas de forma consistente — inclusive por contribuidores que não tiveram contato direto com o mantenedor original.

Foi necessário definir uma notação visual padronizada para representar a arquitetura do sistema: simples o suficiente para ser mantida por um único mantenedor, e estruturada o suficiente para escalar com a entrada de futuros contribuidores.

---

## Decisão

Adotar o **C4 Model** como notação oficial para documentação e representação visual da arquitetura da plataforma PingPong WebComponents.

O C4 Model estrutura a documentação arquitetural em níveis hierárquicos de abstração, cada um detalhando o nível anterior:

1. **Context (Nível 1)** — visão geral do sistema e sua relação com usuários e sistemas externos.
2. **Container (Nível 2)** — as aplicações e pacotes que compõem o sistema (ex: pacotes NPM da plataforma, aplicações consumidoras).
3. **Component (Nível 3)** — os principais componentes internos de cada container e suas responsabilidades.
4. **Code (Nível 4)** — detalhamento a nível de classes e implementação. Opcional, e normalmente delegado ao próprio código-fonte.

A plataforma PingPong adotará os níveis **Context, Container e Component** como obrigatórios. O nível **Code** é opcional e poderá ser omitido sempre que o próprio código-fonte TypeScript for suficientemente autoexplicativo.

Os diagramas correspondentes a cada nível deverão ser mantidos como artefatos versionados no repositório, conforme definido na seção **Fonte Oficial dos Diagramas**.

---

## Motivações

### Simplicidade para mantenedor único

O C4 Model é leve o suficiente para ser mantido por uma única pessoa, sem exigir um processo de governança complexo — diferente de notações mais formais e extensas, como o UML completo.

---

### Escalabilidade para colaboração futura

A estrutura em níveis hierárquicos facilita o onboarding de futuros contribuidores: um novo colaborador pode entender o sistema progressivamente, começando pela visão macro (Context) antes de se aprofundar em componentes específicos (Component).

---

### Linguagem comum e amplamente adotada

O C4 Model é um padrão reconhecido na indústria de arquitetura de software. Isso reduz a curva de aprendizado para contribuidores externos no cenário de evolução para Open Source, já que não exige conhecimento de uma notação proprietária.

---

### Compatibilidade com Markdown e Mermaid

O C4 Model possui boa compatibilidade com notações baseadas em texto, como diagramas Mermaid. Isso permite que os diagramas sejam versionados como código dentro do próprio repositório, alinhado ao princípio de que o Git é a fonte de verdade da arquitetura.

---

## Convenções Definidas

### Governança Arquitetural

Neste momento, a plataforma possui um único mantenedor responsável pelas decisões arquiteturais e evolução técnica do projeto.

A utilização de ferramentas de IA para apoio em design arquitetural, documentação, desenvolvimento e revisão técnica faz parte da estratégia do projeto, sempre sob supervisão e validação humana.

---

### Fonte Oficial dos Diagramas

Os diagramas arquiteturais serão mantidos em duas formas complementares:

#### Git Repository

Utilizado como fonte oficial e versionada da arquitetura.

Formatos preferenciais:

- Markdown
- Mermaid
- ADR (Architecture Decision Records)

#### Miro

Utilizado como ferramenta visual para colaboração, revisão arquitetural e comunicação executiva.

Os diagramas mantidos no Miro deverão refletir a mesma arquitetura representada nos artefatos versionados do repositório.

---

### Princípios Arquiteturais Relacionados

A documentação arquitetural deverá seguir os seguintes princípios:

1. A arquitetura deve ser compreensível para novos contribuidores.
2. Toda decisão relevante deve possuir justificativa documentada através de ADR.
3. Diagramas devem representar a realidade atual do sistema.
4. A documentação deve evoluir junto com o código.
5. O repositório Git é a fonte de verdade da arquitetura.

---

## Alternativas Consideradas

### Nenhuma alternativa formalmente avaliada

A decisão pelo C4 Model foi tomada de forma direta, sem comparação formal com outras notações (como UML completo ou Arc42), em função de seu reconhecimento na indústria, sua simplicidade para um mantenedor único e sua boa compatibilidade com diagramação como código (Mermaid).

<hr />

## Consequências Positivas

- Documentação compreensível tanto para o mantenedor atual quanto para futuros contribuidores
- Diagramas versionáveis como código, alinhados à estratégia de Git como fonte de verdade
- Baixo overhead de manutenção para um mantenedor único
- Padrão amplamente reconhecido, reduzindo a curva de aprendizado em um cenário de evolução Open Source

## Considerações Negativas

- Necessidade de manter os diagramas atualizados conforme o sistema evolui, sob risco de desalinhamento com a realidade do código
- Manutenção duplicada entre Git (fonte oficial) e Miro (comunicação executiva)
- Nível Code, quando necessário, exige disciplina adicional de documentação

---

## Relação com Outros ADRs

### Este ADR depende de:

Nenhum. Esta é a primeira decisão arquitetural formal da plataforma PingPong WebComponents.

### Este ADR impacta:

- ADR-002 - Lit Element v3
- ADR-003 - Fluent UI
- ADR-004 - Fetch API
- ADR-005 - Datadog

Todas as decisões arquiteturais subsequentes deverão referenciar este ADR sempre que a documentação arquitetural for impactada.

---

## Observações

A adoção do C4 Model representa a primeira decisão arquitetural formal da plataforma PingPong WebComponents.

As decisões subsequentes deverão referenciar este ADR sempre que a documentação arquitetural for impactada.
