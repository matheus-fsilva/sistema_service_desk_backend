import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "fatec-service-desk-tickets";
const STATUSES = ["Aberto", "Em andamento", "Resolvido", "Fechado"];
const PRIORITIES = ["Baixa", "Média", "Alta"];

function readTickets() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function ticketNumber(id) {
  return `#${String(id).slice(-5).padStart(5, "0")}`;
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }) {
  const className = status.toLowerCase().replaceAll(" ", "-");
  return <span className={`badge status-${className}`}>{status}</span>;
}

function PriorityBadge({ priority }) {
  return <span className={`badge priority-${priority.toLowerCase()}`}>{priority}</span>;
}

function EmptyState({ title, detail, action, onAction }) {
  return (
    <div className="empty-state">
      <span className="empty-icon" aria-hidden="true">⌕</span>
      <h3>{title}</h3>
      <p>{detail}</p>
      {action && <button className="button button-primary" onClick={onAction}>{action}</button>}
    </div>
  );
}

function TicketTable({ tickets, compact = false, onOpen }) {
  if (!tickets.length) {
    return <EmptyState title="Nenhum chamado encontrado" detail="Quando houver chamados, eles aparecerão nesta lista." />;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Chamado</th>
            <th>Laboratório / máquina</th>
            {!compact && <th>Solicitante</th>}
            <th>Problema</th>
            <th>Prioridade</th>
            <th>Status</th>
            {onOpen && <th aria-label="Ações" />}
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td><span className="ticket-id">{ticketNumber(ticket.id)}</span><small>{formatDate(ticket.createdAt)}</small></td>
              <td><strong>{ticket.lab}</strong><small>{ticket.machine}</small></td>
              {!compact && <td>{ticket.requester}</td>}
              <td className="problem-cell">{ticket.problem}</td>
              <td><PriorityBadge priority={ticket.priority} /></td>
              <td><StatusBadge status={ticket.status} /></td>
              {onOpen && <td><button className="text-button" onClick={() => onOpen(ticket.id)}>Atender <span aria-hidden="true">→</span></button></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TicketForm({ onCancel, onCreate }) {
  const [form, setForm] = useState({ requester: "", lab: "", machine: "", priority: "Média", problem: "" });
  const [error, setError] = useState("");
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  function submit(event) {
    event.preventDefault();
    if (Object.values(form).some((value) => !value.trim())) {
      setError("Preencha todos os campos para abrir o chamado.");
      return;
    }
    onCreate({ ...form, id: Date.now(), status: "Aberto", createdAt: new Date().toISOString(), diagnosis: "", solution: "" });
  }

  return (
    <section className="panel form-panel">
      <div className="panel-heading">
        <div><p className="eyebrow">Solicitação</p><h2>Abrir novo chamado</h2><p>Descreva o equipamento e o problema encontrado.</p></div>
      </div>
      <form onSubmit={submit}>
        <div className="form-grid">
          <label>Nome do solicitante<input name="requester" value={form.requester} onChange={update} placeholder="Seu nome" required /></label>
          <label>Laboratório<input name="lab" value={form.lab} onChange={update} placeholder="Ex.: Laboratório 1" required /></label>
          <label>Máquina / equipamento<input name="machine" value={form.machine} onChange={update} placeholder="Ex.: Computador 08" required /></label>
          <label>Prioridade<select name="priority" value={form.priority} onChange={update}>{PRIORITIES.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="field-full">Problema relatado<textarea name="problem" value={form.problem} onChange={update} rows="5" placeholder="Conte o que aconteceu e quando começou." required /></label>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-actions"><button className="button button-quiet" type="button" onClick={onCancel}>Cancelar</button><button className="button button-primary" type="submit">Enviar chamado <span aria-hidden="true">→</span></button></div>
      </form>
    </section>
  );
}

function AttendanceForm({ ticket, onCancel, onSave }) {
  const [status, setStatus] = useState(ticket.status === "Aberto" ? "Em andamento" : ticket.status);
  const [diagnosis, setDiagnosis] = useState(ticket.diagnosis || "");
  const [solution, setSolution] = useState(ticket.solution || "");
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!diagnosis.trim() || !solution.trim()) {
      setError("Informe o diagnóstico e o que foi feito no atendimento.");
      return;
    }
    onSave({ ...ticket, status, diagnosis, solution, updatedAt: new Date().toISOString() });
  }

  return (
    <section className="panel form-panel">
      <div className="panel-heading">
        <div><p className="eyebrow">Atendimento técnico · {ticketNumber(ticket.id)}</p><h2>Atualizar chamado</h2><p>{ticket.lab} <span className="muted">/</span> {ticket.machine}</p></div>
        <StatusBadge status={ticket.status} />
      </div>
      <div className="original-problem"><span>Problema relatado</span><p>{ticket.problem}</p><small>Aberto por {ticket.requester} em {formatDate(ticket.createdAt)}</small></div>
      <form onSubmit={submit}>
        <div className="form-grid">
          <label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}>{STATUSES.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Problema constatado<input value={diagnosis} onChange={(event) => setDiagnosis(event.target.value)} placeholder="Ex.: Fonte do computador com defeito" required /></label>
          <label className="field-full">Solução / serviço realizado<textarea value={solution} onChange={(event) => setSolution(event.target.value)} rows="4" placeholder="Descreva o que foi feito para resolver." required /></label>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-actions"><button className="button button-quiet" type="button" onClick={onCancel}>Voltar</button><button className="button button-primary" type="submit">Salvar atualização</button></div>
      </form>
    </section>
  );
}

export default function App() {
  const [tickets, setTickets] = useState(readTickets);
  const [page, setPage] = useState("dashboard");
  const [selectedId, setSelectedId] = useState(null);
  const [labFilter, setLabFilter] = useState("Todos os laboratórios");
  const [statusFilter, setStatusFilter] = useState("Todos os status");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets)), [tickets]);

  const orderedTickets = useMemo(() => [...tickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [tickets]);
  const labs = useMemo(() => [...new Set(tickets.map((ticket) => ticket.lab))].sort(), [tickets]);
  const selectedTicket = tickets.find((ticket) => ticket.id === selectedId);
  const openCount = tickets.filter((ticket) => ticket.status === "Aberto").length;
  const progressCount = tickets.filter((ticket) => ticket.status === "Em andamento").length;
  const activeCount = openCount + progressCount;
  const equipmentCount = new Set(tickets.map((ticket) => `${ticket.lab}|${ticket.machine}`)).size;

  const filteredTickets = orderedTickets.filter((ticket) => {
    const matchesLab = labFilter === "Todos os laboratórios" || ticket.lab === labFilter;
    const matchesStatus = statusFilter === "Todos os status" || ticket.status === statusFilter;
    const haystack = `${ticket.id} ${ticket.lab} ${ticket.machine} ${ticket.requester} ${ticket.problem}`.toLocaleLowerCase("pt-BR");
    return matchesLab && matchesStatus && haystack.includes(search.toLocaleLowerCase("pt-BR"));
  });

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 4000);
  }

  function createTicket(ticket) {
    setTickets((current) => [ticket, ...current]);
    setPage("tickets");
    setLabFilter("Todos os laboratórios");
    setStatusFilter("Todos os status");
    showNotice(`Chamado ${ticketNumber(ticket.id)} aberto com sucesso.`);
  }

  function saveTicket(ticket) {
    setTickets((current) => current.map((item) => item.id === ticket.id ? ticket : item));
    setSelectedId(null);
    setPage("tickets");
    showNotice(`Chamado ${ticketNumber(ticket.id)} atualizado.`);
  }

  function openTicket(id) {
    setSelectedId(id);
    setPage("attendance");
  }

  const navItems = [
    { id: "dashboard", label: "Visão geral", icon: "⌂" },
    { id: "tickets", label: "Chamados", icon: "▤" },
    { id: "new", label: "Novo chamado", icon: "+" },
    { id: "public", label: "Painel público", icon: "◉" },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#dashboard" onClick={(event) => { event.preventDefault(); setPage("dashboard"); }}><span className="brand-mark">F</span><span>FATEC <b>TI</b><small>Service Desk</small></span></a>
        <div className="nav-label">MENU PRINCIPAL</div>
        <nav aria-label="Navegação principal">
          {navItems.map((item) => <button key={item.id} className={`nav-link ${page === item.id || (page === "attendance" && item.id === "tickets") ? "active" : ""}`} onClick={() => setPage(item.id)}><span className="nav-icon" aria-hidden="true">{item.icon}</span>{item.label}{item.id === "tickets" && activeCount > 0 && <span className="nav-count">{activeCount}</span>}</button>)}
        </nav>
        <div className="sidebar-bottom"><span className="avatar">TI</span><span><strong>Equipe de suporte</strong><small>FATEC</small></span></div>
      </aside>

      <div className="main-column">
        <header className="topbar"><div><span className="topbar-kicker">SERVICE DESK</span><strong>{page === "new" ? "Novo chamado" : page === "attendance" ? "Atendimento" : page === "public" ? "Painel público" : page === "tickets" ? "Central de chamados" : "Visão geral"}</strong></div><a className="api-link" href="http://localhost:3000/api/docs" target="_blank" rel="noreferrer"><span className="api-dot" />Documentação da API <span aria-hidden="true">↗</span></a></header>

        <main className="content">
          <div className="connection-notice"><span className="notice-icon" aria-hidden="true">i</span><p><strong>Modo local.</strong> O backend ainda não publica rotas de chamados; os dados desta interface ficam salvos somente neste navegador.</p></div>
          {notice && <div className="toast" role="status">✓ {notice}</div>}

          {page === "dashboard" && <>
            <section className="welcome-row"><div><p className="eyebrow">CENTRAL DE SUPORTE</p><h1>Olá, equipe de suporte <span aria-hidden="true">✦</span></h1><p>Acompanhe os chamados e mantenha os laboratórios funcionando.</p></div><button className="button button-primary" onClick={() => setPage("new")}><span aria-hidden="true">＋</span> Abrir chamado</button></section>
            <section className="stats-grid" aria-label="Resumo dos chamados">
              <article className="stat-card"><span className="stat-icon blue">▤</span><span className="stat-label">Chamados abertos</span><strong>{openCount}</strong><small>aguardando atendimento</small></article>
              <article className="stat-card"><span className="stat-icon amber">◷</span><span className="stat-label">Em andamento</span><strong>{progressCount}</strong><small>em atendimento técnico</small></article>
              <article className="stat-card"><span className="stat-icon green">✓</span><span className="stat-label">Total no histórico</span><strong>{tickets.length}</strong><small>chamados registrados</small></article>
              <article className="stat-card"><span className="stat-icon violet">▣</span><span className="stat-label">Equipamentos</span><strong>{equipmentCount}</strong><small>com histórico de chamados</small></article>
            </section>
            <section className="panel table-panel"><div className="panel-heading"><div><p className="eyebrow">ACOMPANHAMENTO</p><h2>Chamados recentes</h2></div><button className="text-button" onClick={() => setPage("tickets")}>Ver todos <span aria-hidden="true">→</span></button></div><TicketTable tickets={orderedTickets.slice(0, 5)} onOpen={openTicket} /></section>
          </>}

          {page === "tickets" && <>
            <section className="page-heading"><div><p className="eyebrow">OPERAÇÃO</p><h1>Central de chamados</h1><p>Consulte, filtre e atualize as solicitações de suporte.</p></div><button className="button button-primary" onClick={() => setPage("new")}>＋ Novo chamado</button></section>
            <section className="panel table-panel"><div className="filter-bar"><label className="search-box"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar chamado, laboratório ou problema" /></label><select aria-label="Filtrar por laboratório" value={labFilter} onChange={(event) => setLabFilter(event.target.value)}><option>Todos os laboratórios</option>{labs.map((lab) => <option key={lab}>{lab}</option>)}</select><select aria-label="Filtrar por status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>Todos os status</option>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select></div><TicketTable tickets={filteredTickets} onOpen={openTicket} /></section>
          </>}

          {page === "new" && <><section className="page-heading"><div><p className="eyebrow">SOLICITAR SUPORTE</p><h1>Conte o que aconteceu</h1><p>As informações ajudam a equipe a localizar e resolver o problema.</p></div></section><TicketForm onCancel={() => setPage("dashboard")} onCreate={createTicket} /></>}

          {page === "attendance" && (selectedTicket ? <><section className="page-heading"><div><p className="eyebrow">SUPORTE TÉCNICO</p><h1>Atendimento do chamado</h1><p>Registre o diagnóstico e a solução aplicada.</p></div></section><AttendanceForm ticket={selectedTicket} onCancel={() => setPage("tickets")} onSave={saveTicket} /></> : <EmptyState title="Chamado não encontrado" detail="O chamado selecionado não está disponível." action="Voltar aos chamados" onAction={() => setPage("tickets")} />)}

          {page === "public" && <>
            <section className="page-heading public-heading"><div><p className="eyebrow">ACESSO PÚBLICO</p><h1>Painel de chamados</h1><p>Acompanhe as solicitações registradas nos laboratórios.</p></div><button className="button button-primary" onClick={() => setPage("new")}>＋ Abrir novo chamado</button></section>
            <section className="public-summary"><div><span>Em aberto / andamento</span><strong>{activeCount}</strong></div><div><span>Total no histórico</span><strong>{tickets.length}</strong></div><label>Laboratório<select value={labFilter} onChange={(event) => setLabFilter(event.target.value)}><option>Todos os laboratórios</option>{labs.map((lab) => <option key={lab}>{lab}</option>)}</select></label></section>
            <section className="panel table-panel"><div className="panel-heading"><div><p className="eyebrow">ATUALIZAÇÕES</p><h2>Chamados registrados</h2></div></div><TicketTable compact tickets={orderedTickets.filter((ticket) => labFilter === "Todos os laboratórios" || ticket.lab === labFilter)} /></section>
          </>}
          <footer className="page-footer">Service Desk · FATEC TI <span>Interface React · dados locais neste navegador</span></footer>
        </main>
      </div>
    </div>
  );
}
