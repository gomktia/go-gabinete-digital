
# Estratégia de Expansão: Executivo (Prefeitos e Governadores)

Atualmente, o sistema **Gabinete Digital** está otimizado para o **Legislativo** (Vereadores/Deputados), focado em *Demandas -> Ofícios/Leis*.
Para atender o **Executivo** (Prefeitos/Governadores), o *core* do sistema é 80% reutilizável, mas o fluxo de trabalho e a nomenclatura precisam de adaptações estratégicas.

## 🔄 O que serve para ambos (Já pronto)
Estas funcionalidades são universais para qualquer político:
*   ✅ **CRM de Eleitores:** Votos são votos, seja para vereador ou governador. A diferença é a escala (necessidade de Big Data).
*   ✅ **Agenda e Eventos:** Compromissos oficiais são rotina de todos.
*   ✅ **Site do Mandato:** Divulgação de trabalho é essencial.
*   ✅ **Financeiro de Campanha:** Arrecadação e gastos eleitorais seguem as mesmas leis.
*   ✅ **Gestão de Equipe:** Prefeitos têm equipes maiores, mas a lógica de permissões se mantém.

## 🛠 Adaptações Necessárias (Legislativo vs. Executivo)

### 1. Nomenclatura e Labels
O Executivo não "faz leis" como atividade principal, ele "faz obras e presta serviços".
*   *Legislativo:* "Meus Projetos de Lei" / "Requerimentos"
*   *Executivo:* "Minhas Obras" / "Programas de Governo" / "Inaugurações"

### 2. Fluxo de Demandas (A maior mudança)
*   **Vereador:** Recebe demanda (Buraco na rua) -> Cria um Ofício -> Envia para a Prefeitura. (Intermediário)
*   **Prefeito:** Recebe demanda -> Encaminha para a **Secretaria de Obras** -> Executa/Resolve. (Executor)
*   *Novo Recurso:* Necessário criar um módulo de **"Gestão de Secretarias"** ou integrar com o sistema oficial da prefeitura (se for gestão pública) ou focar apenas no *feedback* político se for para campanha.

### 3. Escala e Hierarquia (Hierarquia de Poder)
*   Um gabinete de vereador tem 5-20 pessoas.
*   Uma campanha de Prefeito/Governador tem centenas de coordenadores de bairro.
*   *Feature Necessária:* **"Capilaridade da Campanha"**. O módulo de "Genealogia do Voto" se torna crítico. Precisa de níveis de acesso regionais (Ex: O coordenador da Zona Norte só vê eleitores da Zona Norte).

---

## 🚀 Novos Módulos Sugeridos (Versão Executive)

### 1. Dashboard de Realizações (Obras)
Um mapa interativo (já temos o esboço no `VoterMap`) focado não em eleitores, mas em **Obras Entregues**.
*   Pin Verde: Obra Entregue.
*   Pin Amarelo: Em andamento.
*   Pin Vermelho: Promessa de campanha.
*   *Objetivo:* O Prefeito visualiza onde já "pagou o voto" com obras e onde está devendo.

### 2. Monitoramento de Promessas
Um checklist estratégico do Plano de Governo registrado no TSE.
*   Comparativo: Prometido vs. Realizado.
*   Uso de IA para gerar relatórios de prestação de contas ("O que fizemos pela Saúde").

### 3. Inteligência Geográfica Avançada (GIS)
Para Executivos, o território é tudo.
*   Sobrepor dados do CRM com dados do IBGE/Censo.
*   Ex: "Bairros com menor renda votaram menos em nós? Vamos fazer um programa social lá."

---

## 💼 Plano de Negócios: Versionamento

Não precisamos criar outro software. Podemos usar **"Feature Flags"** baseadas no `office_type`.

**Configuração do Tenant:**
```typescript
type OfficeType = 'legislative' | 'executive_city' | 'executive_state';

// No Frontend:
const labels = officeType === 'executive_city' 
   ? { demands: 'Ouvidoria', projects: 'Obras', documents: 'Despachos' } 
   : { demands: 'Gabinete Online', projects: 'Leis', documents: 'Ofícios' };
```

## ✅ Conclusão
O sistema **está pronto** para candidatos a Prefeito (Campanha).
Para Prefeitos **eleitos** (Gestão), precisamos apenas ajustar a "linguagem" (Labels) e adicionar o "Dashboard de Obras".
O valor agregado (Ticket) para Prefeitos/Governadores é **5x a 10x maior** que o de Vereadores.
