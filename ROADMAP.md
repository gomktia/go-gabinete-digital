# Roadmap de Funcionalidades - Gabinete Digital

Este documento consolida as ideias e funcionalidades planejadas para transformar o Gabinete Digital no "Ganador de Eleição e Protetor de Mandato".

## ✅ Funcionalidades Implementadas / Em Teste (v1)

### 1. Sistema Multi-Tenant e Login Seguro
- Isolamento de dados por vereador.
- Login com suporte a contas de demonstração.

### 2. Geolocalização de Votos (O "Mapa da Mina")
- **Status:** [Implementado v1] (`VoterMap.tsx`)
- Visualização de eleitores em mapa de calor.
- filtros por bairro e categoria.

### 3. Prestação de Contas Automática (Gerador de Posts)
- **Status:** [Implementado v1] (`DemandsPage.tsx`)
- Botão "Gerar Card" na demanda.
- Criação automática de imagem "Antes/Depois" pronta para redes sociais.

### 4. Construtor de Site do Mandato (Site Builder)
- **Status:** [Implementado v1] (`MandateSiteBuilder.tsx` e `PublicMandateSite.tsx`)
- Criação de Landing Page completa.
- Seções: Hero, Biografia, Vídeo (YouTube/Vimeo), Galeria de Fotos, Notícias/Blog.
- Link público compartilhável (`/s/nome-do-vereador`).
- Botão flutuante de WhatsApp.

### 5. Termômetro da Reeleição (Simulador de Quociente)
- **Status:** [Implementado v1] (`VirtualAdvisor.tsx`)
- Calculadora de quociente eleitoral e meta de votos.

### 6. Gestores Básicos
- CRM de Eleitores.
- Gestão de Demandas.
- Agenda e Finanças.

---

## 🚀 Próximos Passos (O que falta)

### 1. Entrada de Dados por Voz (O "Zap do Mandato")
**Objetivo:** Permitir cadastro de demandas via áudio para assessores que não gostam de digitar.
- Integração com OpenAI Whisper para transcrever áudio em texto estruturado.

### 2. O "Cérebro da Equipe" (IA Proativa)
**Objetivo:** Dashboard que avisa o vereador onde ele está perdendo terreno.
- Alertas automáticos: "Bairro X está reclamando muito de Iluminação".
- "Sugestão do Dia": Quem visitar hoje.

### 3. Gerador de Ofícios Legislativos (PDF)
**Objetivo:** Transformar a demanda do APP em um PDF oficial da Câmara com um clique.
- Templates jurídicos pré-aprovados.

### 4. Árvore Genealógica do Voto
**Objetivo:** Visualizar quem indicou quem.
- Gráfico de rede mostrando os "Cabos Eleitorais" mais efetivos.

### 5. Radar de Verbas e Diário Oficial
**Objetivo:** Monitoramento automático de oportunidades de recursos.
- Scraper de editais.

### 6. Módulo Financeiro Avançado (SaaS)
**Objetivo:** Vender o software para outros vereadores.
- Integração com Gateway de Pagamento (Stripe/Asaas) para cobrança de assinatura.

