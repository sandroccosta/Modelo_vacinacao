import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'pais',
    data: { pageTitle: 'Pais' },
    loadChildren: () => import('./pais/pais.routes'),
  },
  {
    path: 'fabricante',
    data: { pageTitle: 'Fabricantes' },
    loadChildren: () => import('./fabricante/fabricante.routes'),
  },
  {
    path: 'vacina',
    data: { pageTitle: 'Vacinas' },
    loadChildren: () => import('./vacina/vacina.routes'),
  },
  {
    path: 'doenca',
    data: { pageTitle: 'Doencas' },
    loadChildren: () => import('./doenca/doenca.routes'),
  },
  {
    path: 'pessoa',
    data: { pageTitle: 'Pessoas' },
    loadChildren: () => import('./pessoa/pessoa.routes'),
  },
  {
    path: 'vacinacao-pessoa',
    data: { pageTitle: 'VacinacaoPessoas' },
    loadChildren: () => import('./vacinacao-pessoa/vacinacao-pessoa.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
