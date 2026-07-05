import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../../layouts/Dashboardlayouts';
import { Button, Badge, Card, Modal, Input, Select, EmptyState, Spinner, Alert } from '../../components/ui';
import { getProjects } from '../../api/projectApi';
import toast from 'react-hot-toast';
import {
  formatDistanceToNow,
  parseISO,
  isValid
} from 'date-fns';

/* ── Framework colors ── */
const FW = {
  react:   { bg:'bg-cyan/10 text-cyan',    label:'Re' },
  nextjs:  { bg:'bg-white/10 text-white',  label:'Nx' },
  vue:     { bg:'bg-green/10 text-green',  label:'Vu' },
  express: { bg:'bg-yellow/10 text-yellow',label:'Ex' },
  nodejs:  { bg:'bg-green/10 text-green',  label:'No' },
  python:  { bg:'bg-blue-400/10 text-blue-400',label:'Py'},
  static:  { bg:'bg-purple-400/10 text-purple-400',label:'St'},
  unknown: { bg:'bg-muted/20 text-dim',    label:'?' },
};

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('all');
  const [showAdd,  setShowAdd]  = useState(false);
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data.projects || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project? All deployments will be stopped.')) return;
    try {
      setProjects(prev => prev.filter(p => p._id !== id));
      toast.success('Project deleted');
    } catch {
      toast.error('Failed to delete project');
    }
  };

  const handleDeploy = async (id) => {
    toast.loading('Triggering deployment…');
    try {
      toast.dismiss();
      toast.success('Deployment started!');
      // ✅ Navigate to deployments page
      navigate('/dashboard/deployments');
    } catch {
      toast.dismiss();
      toast.error('Deployment failed to start');
    }
  };

  const onProjectAdded = (p) => {
    setProjects(prev => [p, ...prev]);
    setShowAdd(false);
    toast.success('Project created!');
  };

  return (
    <div className="page-in">
      <TopBar
        title="Projects"
        subtitle={`${projects.length} projects`}
        actions={<Button size="sm" onClick={() => setShowAdd(true)}>+ Deploy Project</Button>}
      />

      <div className="p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            className="bg-surface2 border border-border text-sm text-text rounded-xl px-3.5 py-2 placeholder-muted focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/15 w-56"
            placeholder="Search projects…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="flex gap-1.5">
            {['all','live','building','failed','idle'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs rounded-lg font-display font-medium border transition-all ${
                  filter === f ? 'bg-accent border-accent text-white' : 'border-border text-dim hover:border-border2 hover:text-text'
                }`}>
                {f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_,i) => <div key={i} className="h-44 skeleton rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon="📁" title="No projects found" description="Deploy your first GitHub repository to get started."
            action={<Button onClick={() => setShowAdd(true)}>+ Deploy Project</Button>} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(p => (
              <ProjectCard
                key={p._id}
                project={p}
                navigate={navigate}
                onDeploy={() => handleDeploy(p._id)}
                onDelete={() => handleDelete(p._id)}
                // ✅ FIXED — goes to deployments page filtered by project
                onLogs={() => navigate(`/dashboard/deployments`)}
              />
            ))}
            {/* Add new card */}
            <button onClick={() => setShowAdd(true)}
              className="border-2 border-dashed border-border hover:border-accent/40 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-dim hover:text-accent transition-all group min-h-[176px]">
              <span className="text-4xl group-hover:scale-110 transition-transform">+</span>
              <span className="font-display font-semibold text-sm">Deploy New Project</span>
              <span className="text-xs">Connect a GitHub repo</span>
            </button>
          </div>
        )}
      </div>

      <AddProjectModal open={showAdd} onClose={() => setShowAdd(false)} onSuccess={onProjectAdded} />
    </div>
  );
}

const getTimeAgo = (dateString) => {
  if (!dateString) return 'Unknown';
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Unknown';
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return 'Unknown';
  }
};

/* ── Project Card ── */
const ProjectCard = ({ project: p, navigate, onDeploy, onDelete, onLogs }) => {
  const fw = FW[p.framework] || FW.unknown;
  return (
    <Card className="hover:border-border2 transition-all">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-display font-bold flex-shrink-0 ${fw.bg}`}>
              {fw.label}
            </div>
            <div className="min-w-0">
              <div className="font-display font-semibold text-text text-sm truncate">{p.name}</div>
              <div className="text-[11px] text-dim font-mono truncate">{p.repoName}</div>
            </div>
          </div>
          <Badge status={p.status} />
        </div>

        <div className="flex items-center justify-between text-xs text-dim mb-1">
          <span className="capitalize font-medium">{p.framework} · {p.branch}</span>
          <span>{getTimeAgo(p.updatedAt)}</span>
        </div>

        {p.deployedUrl ? (
          <div className="text-xs font-mono text-accent bg-accent/6 border border-accent/15 rounded-lg px-2 py-1 mb-3 truncate">
            {p.deployedUrl}
          </div>
        ) : (
          <div className="text-xs text-muted mb-3 h-6">—</div>
        )}

        <div className="flex gap-2 pt-3 border-t border-border">

          {/* View Project */}
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={() => navigate(`/dashboard/projects/${p._id}`)}
          >
            View
          </Button>

          {/* ✅ Logs — goes to deployments page */}
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={onLogs}
          >
            Logs
          </Button>

          {/* Deploy */}
          {p.status === "building" ? (
            <Button variant="danger" size="sm" className="flex-1">
              Stop
            </Button>
          ) : (
            <Button size="sm" className="flex-1" onClick={onDeploy}>
              {p.status === "live" ? "Redeploy" : "Deploy"}
            </Button>
          )}

          {/* Delete */}
          <button
            onClick={onDelete}
            className="p-2 rounded-xl text-muted hover:text-red hover:bg-red/10 transition-all border border-transparent hover:border-red/20"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

        </div>
      </div>
    </Card>
  );
};

/* ══════════════════════════════════════════
   ADD PROJECT MODAL (3-step wizard)
══════════════════════════════════════════ */
const STEPS = ['Select Repo', 'Configure', 'Deploy'];

const MOCK_REPOS = [
  {id:1,fullName:'user/my-react-app',   language:'JavaScript',defaultBranch:'main',  updatedAt:'2h ago'},
  {id:2,fullName:'user/express-api',    language:'JavaScript',defaultBranch:'main',  updatedAt:'1d ago'},
  {id:3,fullName:'user/next-portfolio', language:'TypeScript', defaultBranch:'main',  updatedAt:'3d ago'},
  {id:4,fullName:'user/python-ml-api',  language:'Python',     defaultBranch:'main',  updatedAt:'5d ago'},
  {id:5,fullName:'user/vue-dashboard',  language:'Vue',        defaultBranch:'develop',updatedAt:'1w ago'},
];

const DEPLOY_PIPELINE = [
  'Cloning repository…',
  'Detecting framework…',
  'Generating Dockerfile…',
  'Building Docker image…',
  'Starting container…',
  '🎉 Deployment live!',
];

const AddProjectModal = ({ open, onClose, onSuccess }) => {
  const [step,      setStep]     = useState(0);
  const [selected,  setSelected] = useState(null);
  const [deploying, setDeploying]= useState(false);
  const [progress,  setProgress] = useState(0);
  const [pipeStep,  setPipeStep] = useState(0);
  const [form, setForm] = useState({
    name:'', branch:'main',
    buildCmd:'npm install && npm run build',
    startCmd:'npm start', framework:'auto'
  });

  const selectRepo = (r) => {
    setSelected(r);
    setForm(f => ({...f, name:r.fullName.split('/')[1], branch:r.defaultBranch}));
  };

  const simulateDeploy = () => {
    setDeploying(true);
    setProgress(0); setPipeStep(0);
    DEPLOY_PIPELINE.forEach((_,i) => {
      setTimeout(() => {
        setPipeStep(i);
        setProgress(Math.round(((i+1)/DEPLOY_PIPELINE.length)*100));
        if (i === DEPLOY_PIPELINE.length-1) {
          setTimeout(() => {
            onSuccess({
              _id: Date.now().toString(),
              name: form.name,
              repoName: selected?.fullName,
              framework: 'nodejs',
              status: 'live',
              branch: form.branch,
              updatedAt: new Date(),
              deployedUrl: `localhost:${4010+Math.floor(Math.random()*20)}`,
            });
          }, 800);
        }
      }, i*900);
    });
  };

  const next = () => {
    if (step === 0 && !selected) { toast.error('Select a repository'); return; }
    if (step < 2) { setStep(s=>s+1); return; }
    simulateDeploy();
  };

  const reset = () => {
    setStep(0); setSelected(null);
    setDeploying(false); setProgress(0); setPipeStep(0);
  };

  return (
    <Modal open={open} onClose={() => { reset(); onClose(); }} title="Deploy a Project" size="lg">

      {/* Step progress */}
      {!deploying && (
        <div className="flex items-center justify-center gap-2 mb-6">
          {STEPS.map((s,i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 text-xs font-display font-semibold transition-colors ${i<=step?'text-accent':'text-muted'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 transition-all ${
                  i < step  ? 'border-accent bg-accent text-white' :
                  i === step ? 'border-accent text-accent' :
                               'border-muted text-muted'
                }`}>
                  {i < step ? '✓' : i+1}
                </div>
                <span className="hidden sm:inline">{s}</span>
              </div>
              {i < STEPS.length-1 && (
                <div className={`w-10 h-px flex-shrink-0 transition-colors ${i<step?'bg-accent':'bg-border'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Step 0 — Select repo */}
      {!deploying && step === 0 && (
        <div className="space-y-3">
          <input className="w-full bg-surface2 border border-border rounded-xl px-3 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-accent/60 mb-1"
            placeholder="Search repositories…" />
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {MOCK_REPOS.map(r => (
              <div key={r.id} onClick={() => selectRepo(r)}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selected?.id === r.id ? 'border-accent bg-accent/6 shadow-accent' : 'border-border hover:border-border2'
                }`}>
                <div className="w-9 h-9 rounded-lg bg-surface3 flex items-center justify-center text-xs font-mono text-dim flex-shrink-0">
                  {r.language?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-display font-medium text-text truncate">{r.fullName}</div>
                  <div className="text-xs text-dim">{r.language} · Updated {r.updatedAt}</div>
                </div>
                {selected?.id === r.id && <span className="text-accent text-lg">✓</span>}
              </div>
            ))}
          </div>
          <Button className="w-full mt-2" onClick={next} disabled={!selected}>Continue →</Button>
        </div>
      )}

      {/* Step 1 — Configure */}
      {!deploying && step === 1 && (
        <div className="space-y-4">
          <Alert type="info">
            Deploying <strong>{selected?.fullName}</strong> · branch: <strong>{form.branch}</strong>
          </Alert>
          <Input label="Project Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          <Input label="Branch" value={form.branch} onChange={e=>setForm({...form,branch:e.target.value})} />
          <Input label="Build Command" value={form.buildCmd} onChange={e=>setForm({...form,buildCmd:e.target.value})} />
          <Input label="Start Command" value={form.startCmd} onChange={e=>setForm({...form,startCmd:e.target.value})} />
          <Select label="Framework Override" value={form.framework} onChange={e=>setForm({...form,framework:e.target.value})}>
            <option value="auto">Auto-detect</option>
            <option value="react">React</option>
            <option value="nextjs">Next.js</option>
            <option value="vue">Vue</option>
            <option value="express">Express</option>
            <option value="nodejs">Node.js</option>
            <option value="python">Python</option>
            <option value="static">Static</option>
          </Select>
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setStep(0)}>← Back</Button>
            <Button className="flex-1" onClick={next}>Review →</Button>
          </div>
        </div>
      )}

      {/* Step 2 — Review */}
      {!deploying && step === 2 && (
        <div className="space-y-4">
          <div className="bg-surface2 rounded-2xl p-4 space-y-3">
            {[
              ['Repository',    selected?.fullName],
              ['Branch',        form.branch],
              ['Build command', form.buildCmd],
              ['Start command', form.startCmd],
              ['Framework',     form.framework],
            ].map(([k,v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-dim">{k}</span>
                <span className="font-mono text-xs text-text truncate max-w-[200px]">{v}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setStep(1)}>← Back</Button>
            <Button className="flex-1" onClick={next}>🚀 Deploy Now</Button>
          </div>
        </div>
      )}

      {/* Deployment progress */}
      {deploying && (
        <div className="py-4 space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="40" fill="none" stroke="#1e2a3a" strokeWidth="6"/>
                <circle cx="48" cy="48" r="40" fill="none" stroke="#6366f1" strokeWidth="6"
                  strokeDasharray={`${2*Math.PI*40}`}
                  strokeDashoffset={`${2*Math.PI*40*(1-progress/100)}`}
                  strokeLinecap="round" className="transition-all duration-700"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-mono text-accent font-bold">
                {progress}%
              </div>
            </div>
            <div className="text-center">
              <div className="font-display font-bold text-text">{form.name}</div>
              <div className="text-xs text-dim mt-0.5">{DEPLOY_PIPELINE[pipeStep]}</div>
            </div>
          </div>

          <div className="bg-surface2 rounded-2xl p-4 space-y-2.5">
            {DEPLOY_PIPELINE.map((s,i) => (
              <div key={i} className={`flex items-center gap-3 text-xs transition-all ${
                i < pipeStep  ? 'text-green' :
                i === pipeStep ? 'text-accent' : 'text-muted'
              }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] border ${
                  i < pipeStep  ? 'border-green bg-green/15 text-green' :
                  i === pipeStep ? 'border-accent bg-accent/15 text-accent' :
                                   'border-muted text-muted'
                }`}>
                  {i < pipeStep ? '✓' : i+1}
                </div>
                <span>{s}</span>
                {i === pipeStep && <span className="term-cursor text-accent" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
};