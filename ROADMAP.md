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

### 7. Gerador de Ofícios Legislativos (PDF)
- **Status:** [Implementado v1] (`DocumentGeneratorModal.tsx`)
- Transformação de demandas em documentos oficiais (Ofícios, Requerimentos, Moções).
- Templates editáveis com preview em tempo real.
- Exportação para PDF (A4).

### 8. Entrada de Dados por Voz (O "Zap do Mandato")
- **Status:** [Implementado v1] (`DemandsPage.tsx`)
- Reconhecimento de fala via Web Speech API.
- Preenchimento automático de Título e Local via simulação de IA.

### 9. O "Cérebro da Equipe" (IA Proativa)
- **Status:** [Implementado v1] (`MandateIntelligence.tsx` e `Dashboard.tsx`)
- Dashboard com "Alertas de Crise" (Demandas acumuladas em bairros).
- "Sugestão do Dia" baseada em eleitores sem contato recente.
- Oportunidades de ações legislativas baseadas em categorias de demandas.

### 10. Árvore Genealógica do Voto
- **Status:** [Implementado v1] (`VoteGenealogy.tsx`)
- Visualização hierárquica de indicações (Referral Tree).
- Identificação visual de "Cabos Eleitorais" influentes.
- Navegação recursiva por nós da rede.

### 11. Radar de Verbas e Diário Oficial
- **Status:** [Implementado v1] (`VerbasRadar.tsx`)
- Monitoramento de editais, emendas e verbas estaduais/federais.
- Filtros por tipo de oportunidade (Edital, Verba, Emenda).
- Interface de busca rápida com alertas de "Novo".

### 12. Módulo Financeiro Avançado (SaaS)
- **Status:** [Implementado v1] (`SubscriptionPage.tsx` e `SuperAdmin.tsx`)
- Estrutura multi-tenant com gerenciamento de planos (Free, Pro, Enterprise).
- Página de assinatura para vereadores (Upgrade de plano).
- Painel Super Admin para controle de receita e status dos clientes.
- Preparado para integração com Gateways (Stripe, Asaas, Kiwify).

---

## 🚀 Próximos Passos (O que falta)

_Roadmap inicial completo! O sistema está pronto para ser comercializado._

