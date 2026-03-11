import type { AppState } from '@/types/studyos';

const SEM_ID = 'sem-2025-1';
const SUBJ = {
  es: 'subj-eng-soft',
  bd: 'subj-banco-dados',
  rc: 'subj-redes',
  gp: 'subj-gestao-proj',
  ei: 'subj-empreend',
};

export function seedData(): AppState {
  return {
    profile: {
      name: 'Estudante',
      course: 'Sistemas de Informação',
      university: 'Unisinos',
      modality: 'EAD',
      email: '',
      avatarColor: '#1A6FD4',
      onboardingDone: false,
      weekStartsOnMonday: true,
      defaultTaskView: 'list',
    },
    semesters: [
      { id: SEM_ID, name: '2025/1', startDate: '2025-03-03', endDate: '2025-07-12', active: true, archived: false },
    ],
    subjects: [
      { id: SUBJ.es, name: 'Engenharia de Software', code: 'SI204', professor: 'Prof. Ana Beatriz Souza', creditHours: 60, credits: 4, semesterId: SEM_ID, color: '#1A6FD4', description: 'Princípios e práticas de engenharia de software, metodologias ágeis e gestão de projetos.', avaLink: 'https://ava.unisinos.br', schedule: [{ day: 2, time: '19:00' }, { day: 4, time: '19:00' }], status: 'ativa' },
      { id: SUBJ.bd, name: 'Banco de Dados II', code: 'SI208', professor: 'Prof. Carlos Eduardo Lima', creditHours: 60, credits: 4, semesterId: SEM_ID, color: '#22C55E', description: 'Modelagem avançada, normalização, SQL avançado, NoSQL e otimização de consultas.', avaLink: 'https://ava.unisinos.br', schedule: [{ day: 3, time: '19:00' }], status: 'ativa' },
      { id: SUBJ.rc, name: 'Redes de Computadores', code: 'SI210', professor: 'Prof. Roberto Almeida', creditHours: 60, credits: 4, semesterId: SEM_ID, color: '#F59E0B', description: 'Arquitetura TCP/IP, protocolos, roteamento e segurança de redes.', avaLink: 'https://ava.unisinos.br', schedule: [{ day: 1, time: '19:00' }, { day: 5, time: '19:00' }], status: 'ativa' },
      { id: SUBJ.gp, name: 'Gestão de Projetos de TI', code: 'SI215', professor: 'Prof. Mariana Costa', creditHours: 30, credits: 2, semesterId: SEM_ID, color: '#A855F7', description: 'PMBOK, Scrum, gestão de escopo, custos e riscos em projetos de TI.', avaLink: 'https://ava.unisinos.br', schedule: [{ day: 2, time: '21:00' }], status: 'ativa' },
      { id: SUBJ.ei, name: 'Empreendedorismo e Inovação', code: 'AD310', professor: 'Prof. Fernando Rocha', creditHours: 30, credits: 2, semesterId: SEM_ID, color: '#EC4899', description: 'Modelos de negócio, lean startup, pitch e inovação tecnológica.', avaLink: 'https://ava.unisinos.br', schedule: [{ day: 4, time: '21:00' }], status: 'ativa' },
    ],
    evaluations: [
      { id: 'eval-1', subjectId: SUBJ.es, name: 'Prova 1', weight: 30, score: 8.5, date: '2025-04-10' },
      { id: 'eval-2', subjectId: SUBJ.es, name: 'Trabalho em Grupo', weight: 30, score: 9.0, date: '2025-05-15' },
      { id: 'eval-3', subjectId: SUBJ.es, name: 'Prova Final', weight: 40, score: null, date: '2025-06-20' },
      { id: 'eval-4', subjectId: SUBJ.bd, name: 'Prova 1', weight: 40, score: 7.0, date: '2025-04-12' },
      { id: 'eval-5', subjectId: SUBJ.bd, name: 'Projeto Prático', weight: 60, score: null, date: '2025-06-18' },
      { id: 'eval-6', subjectId: SUBJ.rc, name: 'Prova 1', weight: 50, score: 6.5, date: '2025-04-15' },
      { id: 'eval-7', subjectId: SUBJ.rc, name: 'Prova 2', weight: 50, score: null, date: '2025-06-22' },
    ],
    tasks: [
      { id: 'task-1', title: 'Diagrama de Classes — Sistema de Biblioteca', description: 'Modelar o diagrama de classes UML para o sistema proposto.', subjectId: SUBJ.es, type: 'trabalho', dueDate: '2025-03-20', priority: 'alta', estimatedMinutes: 180, checklist: [{ id: 'c1', text: 'Identificar classes', done: true }, { id: 'c2', text: 'Definir atributos', done: false }], link: '', status: 'em_andamento', kanbanColumn: 'em_andamento', createdAt: '2025-03-10T10:00:00Z' },
      { id: 'task-2', title: 'Exercícios SQL — Joins e Subqueries', description: 'Lista de exercícios sobre joins, subqueries e aggregation.', subjectId: SUBJ.bd, type: 'atividade', dueDate: '2025-03-18', priority: 'média', estimatedMinutes: 120, checklist: [], link: '', status: 'a_fazer', kanbanColumn: 'para_estudar', createdAt: '2025-03-09T10:00:00Z' },
      { id: 'task-3', title: 'Leitura: TCP/IP Illustrated Cap. 5', description: 'Capítulo sobre camada de transporte.', subjectId: SUBJ.rc, type: 'leitura', dueDate: '2025-03-22', priority: 'baixa', estimatedMinutes: 90, checklist: [], link: '', status: 'a_fazer', kanbanColumn: 'backlog', createdAt: '2025-03-08T10:00:00Z' },
      { id: 'task-4', title: 'Estudo de Caso: Projeto Scrum', description: 'Analisar case de implementação de Scrum em empresa de TI.', subjectId: SUBJ.gp, type: 'trabalho', dueDate: '2025-03-25', priority: 'alta', estimatedMinutes: 150, checklist: [], link: '', status: 'a_fazer', kanbanColumn: 'backlog', createdAt: '2025-03-07T10:00:00Z' },
      { id: 'task-5', title: 'Fórum: Inovação Disruptiva', description: 'Participar do fórum sobre inovação disruptiva e responder 2 colegas.', subjectId: SUBJ.ei, type: 'fórum', dueDate: '2025-03-19', priority: 'média', estimatedMinutes: 45, checklist: [], link: '', status: 'a_fazer', kanbanColumn: 'para_estudar', createdAt: '2025-03-06T10:00:00Z' },
      { id: 'task-6', title: 'Prova 1 — Engenharia de Software', description: 'Estudar capítulos 1-5 do Sommerville.', subjectId: SUBJ.es, type: 'prova', dueDate: '2025-04-10', priority: 'alta', estimatedMinutes: 300, checklist: [], link: '', status: 'a_fazer', kanbanColumn: 'backlog', createdAt: '2025-03-05T10:00:00Z' },
      { id: 'task-7', title: 'Relatório de Laboratório — Redes', description: 'Documentar configuração de roteador virtual.', subjectId: SUBJ.rc, type: 'trabalho', dueDate: '2025-03-28', priority: 'média', estimatedMinutes: 120, checklist: [], link: '', status: 'a_fazer', kanbanColumn: 'backlog', createdAt: '2025-03-04T10:00:00Z' },
      { id: 'task-8', title: 'Canvas de Modelo de Negócios', description: 'Preencher Business Model Canvas para startup proposta.', subjectId: SUBJ.ei, type: 'trabalho', dueDate: '2025-03-30', priority: 'alta', estimatedMinutes: 120, checklist: [], link: '', status: 'a_fazer', kanbanColumn: 'backlog', createdAt: '2025-03-03T10:00:00Z' },
    ],
    events: [
      { id: 'evt-1', title: 'Aula ao vivo — Eng. Software', type: 'aula_ao_vivo', subjectId: SUBJ.es, date: '2025-03-11', time: '19:00', endTime: '20:30', recurring: true, frequency: 'weekly', endRecurDate: '2025-07-12', description: '', link: 'https://meet.google.com', priority: 'média' },
      { id: 'evt-2', title: 'Entrega: Diagrama de Classes', type: 'trabalho', subjectId: SUBJ.es, date: '2025-03-20', time: '23:59', endTime: '', recurring: false, frequency: null, endRecurDate: '', description: 'Entregar via AVA', link: '', priority: 'alta' },
    ],
    notes: [
      { id: 'note-1', title: 'Resumo — Padrões de Projeto', content: '## Padrões Criacionais\n\n- **Singleton**: Garante uma única instância\n- **Factory Method**: Delega criação para subclasses\n- **Abstract Factory**: Família de objetos relacionados\n\n## Padrões Estruturais\n\n- **Adapter**: Interface incompatível → compatível\n- **Decorator**: Adiciona responsabilidades dinamicamente', subjectId: SUBJ.es, tags: ['resumo', 'design-patterns'], starred: true, createdAt: '2025-03-08T14:00:00Z', updatedAt: '2025-03-10T16:00:00Z' },
      { id: 'note-2', title: 'Anotações — Normalização de Dados', content: '## Formas Normais\n\n1. **1FN**: Atributos atômicos\n2. **2FN**: Sem dependências parciais\n3. **3FN**: Sem dependências transitivas\n\n> Lembrar: cada forma normal resolve um tipo específico de anomalia.', subjectId: SUBJ.bd, tags: ['aula', 'normalização'], starred: false, createdAt: '2025-03-09T14:00:00Z', updatedAt: '2025-03-09T16:00:00Z' },
    ],
    links: [
      { id: 'link-1', title: 'Normas ABNT — Formatação', url: 'https://www.abnt.org.br', description: 'Referência para formatação de trabalhos acadêmicos', category: 'documentação', subjectId: '', favicon: '', favorite: true, createdAt: '2025-03-01T10:00:00Z' },
      { id: 'link-2', title: 'Moodle Unisinos', url: 'https://ava.unisinos.br', description: 'Plataforma de aprendizagem da Unisinos', category: 'ava', subjectId: '', favicon: '', favorite: true, createdAt: '2025-03-01T10:00:00Z' },
      { id: 'link-3', title: 'IEEE Xplore', url: 'https://ieeexplore.ieee.org', description: 'Base de artigos e papers de tecnologia', category: 'artigo', subjectId: '', favicon: '', favorite: false, createdAt: '2025-03-01T10:00:00Z' },
    ],
    files: [],
    kanbanColumns: [
      { id: 'backlog', title: 'Backlog', order: 0 },
      { id: 'para_estudar', title: 'Para Estudar', order: 1 },
      { id: 'em_andamento', title: 'Em Andamento', order: 2 },
      { id: 'em_revisão', title: 'Em Revisão', order: 3 },
      { id: 'concluído', title: 'Concluído', order: 4 },
    ],
    notifications: [],
  };
}
