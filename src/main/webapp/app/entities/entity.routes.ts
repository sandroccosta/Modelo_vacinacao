import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'pais',
    data: { pageTitle: 'exemploModeloVacinacaoApp.pais.home.title' },
    loadChildren: () => import('./pais/pais.routes'),
  },
  {
    path: 'fabricante',
    data: { pageTitle: 'exemploModeloVacinacaoApp.fabricante.home.title' },
    loadChildren: () => import('./fabricante/fabricante.routes'),
  },
  {
    path: 'vacina',
    data: { pageTitle: 'exemploModeloVacinacaoApp.vacina.home.title' },
    loadChildren: () => import('./vacina/vacina.routes'),
  },
  {
    path: 'doenca',
    data: { pageTitle: 'exemploModeloVacinacaoApp.doenca.home.title' },
    loadChildren: () => import('./doenca/doenca.routes'),
  },
  {
    path: 'pessoa',
    data: { pageTitle: 'exemploModeloVacinacaoApp.pessoa.home.title' },
    loadChildren: () => import('./pessoa/pessoa.routes'),
  },
  {
    path: 'vacinacao-pessoa',
    data: { pageTitle: 'exemploModeloVacinacaoApp.vacinacaoPessoa.home.title' },
    loadChildren: () => import('./vacinacao-pessoa/vacinacao-pessoa.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
