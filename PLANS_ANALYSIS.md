
# Estratégia de Precificação e Planos - Gabinete Digital

Baseado na análise completa das funcionalidades desenvolvidas e no mercado de tecnologia política (Politech) brasileiro, defino abaixo a estrutura de planos ideal para maximizar a conversão e o LTV (Lifetime Value) dos clientes.

## 📊 Visão Geral do Mercado
O mercado político carece de ferramentas *all-in-one*. Geralmente contratam-se ferramentas separadas: um CRM, um disparador de Email/Whats, um site builder e consultoria jurídica.
O **Gabinete Digital** centraliza tudo. Isso permite cobrar um ticket médio mais alto que um CRM simples, mas mais barato que a soma das ferramentas isoladas.

---

## 💎 Definição dos Planos

### 1. Plano ESSENCIAL (O Organizador)
**Público Alvo:** Vereadores de pequenas cidades (até 20k hab), suplentes ou candidatos iniciantes.
**Objetivo:** Tirar o mandato do papel e planilha Excel. Organização básica.
**Preço Sugerido:** **R$ 197,00 / mês** (ou R$ 1.970,00 anual)

**Funcionalidades Inclusas:**
*   ✅ **CRM de Eleitores:** Até 2.000 contatos.
*   ✅ **Gestão de Demandas:** Kanban básico (Sem automação).
*   ✅ **Agenda e Calendário:** Simples.
*   ✅ **Site do Mandato:** Versão Standard (Domínio compartilhado, layout fixo).
*   ✅ **Equipe:** Até 2 assessores.
*   🚫 **Sem IA (Discursos, Legendas, Consultor).**
*   🚫 **Sem Gerador de Documentos PDF.**
*   🚫 **Sem Radar de Verbas.**
*   🚫 **Sem Árvore Genealógica.**

---

### 2. Plano PROFISSIONAL (O Produtivo) ⭐ *Recomendado*
**Público Alvo:** Vereadores de média cidade, reeleição, focados em comunicação e produtividade.
**Objetivo:** Automatizar a rotina legislativa e melhorar a comunicação.
**Preço Sugerido:** **R$ 497,00 / mês** (ou R$ 4.970,00 anual)

**Funcionalidades Inclusas:**
*   ✅ **Tudo do Essencial +**
*   ✅ **CRM de Eleitores:** Até 15.000 contatos.
*   ✅ **Inteligência Artificial (Light):**
    *   Gerador de Legendas para Redes Sociais.
    *   Corretor de Textos.
*   ✅ **Gerador de Documentos Legislativos:** Criação ilimitada de Ofícios/Requerimentos em PDF.
*   ✅ **Site do Mandato:** Versão PRO (Blog, Galeria, Personalização de Cores).
*   ✅ **WhatsApp:** Integração com Link Direto e mensagens pré-definidas.
*   ✅ **Financeiro de Campanha:** Controle de caixa simples.
*   ✅ **Equipe:** Até 10 assessores.
*   🚫 **Sem Radar de Verbas (Dinheiro).**
*   🚫 **Sem Árvore Genealógica (Votos).**
*   🚫 **Sem IA Estratégica ("Cérebro" / Advisor).**

---

### 3. Plano ELITE (O Estratégico) 🚀
**Público Alvo:** Presidentes de Câmara, Vereadores de Capitais, Deputados e quem busca "Poder".
**Objetivo:** Inteligência de dados para garantir votos e verbas.
**Preço Sugerido:** **R$ 997,00 / mês** (ou R$ 9.970,00 anual)

**Funcionalidades Exclusivas (Ouro):**
*   ✅ **Tudo do Profissional +**
*   ✅ **CRM Ilimitado.**
*   ✅ **Radar de Verbas:** Monitoramento automático de Editais e Emendas (Scraper).
*   ✅ **Árvore Genealógica do Voto:** Visualização de rede de influências e cabos eleitorais.
*   ✅ **Mapa de Calor (Geo):** Inteligência territorial dos votos.
*   ✅ **O "Cérebro" (IA Full):**
    *   Advisor Estratégico Proativo.
    *   Análise de Sentimento das Demandas.
    *   Discursos Completos personalizados.
*   ✅ **Suporte VIP:** WhatsApp direto do Gerente de Contas.
*   ✅ **Equipe Ilimitada.**

---

## 🔒 Tabela Técnica de "Feature Gating" (Travas do Sistema)

| Funcionalidade / Módulo | Variável no Código (`tenant.plan`) | Essencial | Profissional | Elite |
| :--- | :--- | :---: | :---: | :---: |
| **Limite de Eleitores** | `MAX_VOTERS` | 2.000 | 15.000 | ∞ |
| **Limite de Assessores** | `MAX_USERS` | 2 | 10 | ∞ |
| **Gerador de Documentos (PDF)** | `feat_docs` | 🔒 | ✅ | ✅ |
| **IA (Virtual Advisor)** | `feat_ai_advisor` | 🔒 | Limidada | ✅ Total |
| **Radar de Verbas** | `feat_radar` | 🔒 | 🔒 | ✅ |
| **Árvore Genealógica** | `feat_genealogy` | 🔒 | 🔒 | ✅ |
| **Mapa de Eleitores** | `feat_map` | 🔒 | 🔒 | ✅ |
| **Site Builder** | `feat_site` | Básico | Pro | Pro |

## 📝 Próximos Passos Técnicos
1.  **Atualizar `TenantContext`:** Criar uma função utilitária `checkFeature('feature_name')` ou `canAccess('radar')` para facilitar o bloqueio na UI.
2.  **Atualizar `SubscriptionPage`:** Refletir exatamente esses 3 planos e preços.
3.  **Implementar Bloqueios Visuais:** Colocar componentes de "Cadeado" ou "Upgrade" nas páginas quando o usuário não tiver o plano adequado (ex: Ao tentar entrar no Radar de Verbas sendo plano Básico).
