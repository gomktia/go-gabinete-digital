
# Ecossistema Político: Hierarquia e Planos por Cargo

Para atender Prefeitos, Governadores e Senadores, o sistema deixa de ser apenas um "Gabinete" e vira um **QG de Inteligência**. A principal diferença não é *o que* se faz, mas a **ESCALA** e a **HIERARQUIA** da equipe.

## 1. Nova Estrutura de Equipe (Hierarquia)

Um vereador gerencia 10 pessoas. Um governador gerencia 10.000. O sistema precisa de "Níveis de Acesso" granulares:

| Nível de Acesso (Role) | Descrição | Foco (Legislativo) | Foco (Executivo/Majoritário) |
| :--- | :--- | :--- | :--- |
| **Líder (Owner)** | O Político (Dono da conta). | Visão Geral. | Visão Geral. |
| **Chefe de Gabinete (Admin)** | Gerente geral. Acesso total. | Articulação Política. | Gestão de Crise e Governo. |
| **Secretário/Diretor (Manager)** 🆕 | Líder de um setor ou tema. | Diretor de Comunicação. | Secretário de Saúde/Obras. |
| **Coordenador Regional (Leader)** 🆕 | Cuida de uma área geográfica. | Líder de Bairro. | Coordenador da "Macro-região Norte". |
| **Mobilizador (Agent)** | O "formiguinha" na rua. | Cabo Eleitoral. | Cabo Eleitoral / Líder Comunitário. |

### Cenário: Governador
*   **Desafio:** O estado tem 500 cidades. O Governador não vê o eleitor individual.
*   **Solução no Sistema:** O Coordenador da "Região Serrana" só vê os dados da Região Serrana. O sistema precisa de **Segregação de Dados por Território** (Row Level Security no Banco de Dados).

### Cenário: Prefeito (Reeleição)
*   **Desafio:** Mistura de "Gestão" (Obras) com "Política" (Voto).
*   **Solução no Sistema:**
    *   Os **Secretários** usam o módulo de Obras/Demandas para resolver problemas.
    *   Os **Vereadores da Base** (aliados) podem ter acesso restrito para ver *suas* indicações sendo atendidas pelo Prefeito (Isso vale ouro!).

---

## 2. Precificação por Cargo (Tabela Matrix)

Não podemos cobrar de um Governador o mesmo que de um Vereador. O valor (e o volume de dados) é exponencial.

| Plano / Cargo | Vereador (Pequeno) | Vereador (Médio/Grande) | Prefeito (Pequeno) | Prefeito (Grande) | Deputado Estadual | Deputado Federal | Governador/Senador |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Valor Mensal (Est.)** | R$ 197 | R$ 497 | R$ 997 | R$ 2.497 | R$ 1.497 | R$ 2.997 | **Sob Consulta** (Enterprise) |
| **Usuários (Equipe)** | 2 | 10 | 15 | 50 | 20 | 40 | Ilimitado |
| **Eleitores (CRM)** | 2k | 15k | 30k | 200k | 100k | 500k | Ilimitados (Big Data) |
| **Funcionalidade Chave** | Agenda | Ofícios PDF | Obras Simples | Gestão de Secretarias | Emendas Estaduais | Emendas Federais | Inteligência Geográfica (GIS) |
| **Sub-tenants** | ❌ | ❌ | ❌ | ✅ (Vereadores da base) | ✅ (Líderes Regionais) | ✅ (Dobradinhas) | ✅ (Prefeitos Aliados) |

> **O Pulo do Gato (Sub-tenants):** Um Deputado Federal ou Governador muitas vezes "paga" o sistema para seus aliados (Vereadores/Prefeitos menores) usarem.
> O sistema deve permitir que um **"Tenant Pai" (Governador)** veja dados agregados dos **"Tenants Filhos" (Prefeitos aliados)**.

---

## 3. Implementação Técnica Necessária

1.  **Novas Roles no Banco:** Adicionar `manager` (Secretário) e `leader` (Coordenador Regional).
2.  **Segregação Geográfica:** Adicionar campo `territory_id` ou `region` aos usuários e eleitores. Se o usuário tem `region = 'Zona Norte'`, ele só vê eleitores da Zona Norte.
3.  **Relacionamento Tenant-Pai/Filho:** Criar estrutura para "Coligações" ou "Hierarquia Partidária", onde um gabinete grande monitora gabinetes menores.

Isso transforma o Gabinete Digital de um "SaaS de Vereador" para uma **Plataforma de Gestão Partidária Completa**.
