# Roadmap de Funcionalidades - Gabinete Digital

Este documento consolida as ideias e funcionalidades planejadas para transformar o Gabinete Digital no "Ganador de Eleição e Protetor de Mandato".

## 1. Entrada de Dados por Voz (O "Zap do Mandato")
**Objetivo:** Permitir cadastro de demandas via áudio para assessores que não gostam de digitar.
**Como funciona:**
- Botão de microfone no app.
- Transcrição do áudio (Whisper/OpenAI).
- IA extrai: Quem (Eleitor), Onde (Local/Bairro), O que (Categoria/Descrição).
- Criação automática do card de demanda.
**Viabilidade Técnica:** Alta (Supabase Edge Functions + OpenAI API).

## 2. O "Lembrete de Aniversário e Mateada"
**Objetivo:** Notificar o vereador sobre datas importantes para manter o relacionamento.
**Como funciona:**
- Job diário verifica aniversários do dia.
- Cruzamento com líderanças ("Dona Maria, líder das artesãs").
- Geração de link direto para WhatsApp com sugestão de mensagem.
**Viabilidade Técnica:** Média (Requer integração confiável com WhatsApp ou apenas links `wa.me`, Supabase Cron).

## 3. Prestação de Contas Automática (O "Cala-Boca" da Oposição)
**Objetivo:** Gerar material de divulgação instantâneo após conclusão de demandas.
**Como funciona:**
- Ao mover demanda para "Concluído".
- Gerar imagem/PDF com logo do vereador + Foto do "Antes/Depois" + Texto "Pedido Atendido".
- Botão de compartilhamento direto.
**Viabilidade Técnica:** Alta (HTML5 Canvas ou biblioteca de geração de PDF).

## 4. Geolocalização de Votos (O "Mapa da Mina")
**Objetivo:** Visualizar distribuição de votos para estratégia de campanha.
**Como funciona:**
- Importação de CSV do TRE.
- Mapa de calor sobreposto ao mapa da cidade.
- Cruzamento com localização das demandas atendidas.
**Viabilidade Técnica:** Média (Requer tratamento de dados do TRE e biblioteca de mapas).

## 5. O "Cérebro da Equipe" (Inteligência Artificial)
**Objetivo:** IA proativa que sugere estratégias baseadas em dados.
**Como funciona:**
- Analisa volume de demandas por bairro/tópico.
- Sugere ações agrupadas (Ofício Único).
- Identifica tendências negativas.
**Viabilidade Técnica:** Alta (Análise de dados no banco + Prompt de IA).

---

## Funcionalidades "Pulo do Gato" (Diferenciais de Mercado)

### 1. Gerador de Ofícios Instantâneo
- **Descrição:** Transforma demanda informal em documento oficial (PDF) com leis e técnica legislativa.
- **Viabilidade:** Alta.

### 2. "Árvore Genealógica" do Voto
- **Descrição:** Cadastro de hierarquia de influência (Quem indicou quem). Mapa visual de lideranças.
- **Viabilidade:** Alta (Estrutura de dados recursiva).

### 3. Calendário de Eventos da Comunidade ("Agenda Gaúcha")
- **Descrição:** Agenda compartilhada de eventos locais com alertas de presença estratégica.
- **Viabilidade:** Alta.

### 4. Gestão de "Promessas x Entregas"
- **Descrição:** Barra de progresso de promessas de campanha. Alerta de prazos e disparos de prestação de contas.
- **Viabilidade:** Média (Depende de integração com mensageria).

---

## Funcionalidades de Escala Nacional

### 1. Radar de Verbas
- **Descrição:** Monitoramento de editais e diários oficiais para captar recursos.
- **Viabilidade:** Complexa (Requer scrapers/fontes de dados externas robustas).

### 2. Gestão de "Afilhados" e Lideranças (CRM Político)
- **Descrição:** Monitoramento da temperatura de lideranças (parou de trazer votos = alerta).
- **Viabilidade:** Alta.

### 3. "Vacina" Anti-Fake News
- **Descrição:** Disparo rápido de vídeos de esclarecimento para base segmentada.
- **Viabilidade:** Média (Depende de API de WhatsApp em massa oficial/não-oficial).

### 4. Termômetro da Reeleição (Simulador de Quociente)
- **Descrição:** Cálculo de votos necessários baseados na legenda e histórico da cidade.
- **Viabilidade:** Alta (Lógica matemática pura).

### 5. "Tradutor para Povês"
- **Descrição:** IA reescreve textos técnicos para linguagem popular de redes sociais.
- **Viabilidade:** Muito Alta (Funcionalidade nativa de LLMs).
