import IProjeto from "@/interfaces/IProjeto";
import { createStore, Store, useStore as vuexUseStore } from "vuex";
import { InjectionKey } from 'vue'
import { ADICIONA_PROJETO, ADICIONA_TAREFA, ALTERA_PROJETO, DEFINIR_PROJETOS, DEFINIR_TAREFAS, EXCLUIR_PROJETO, NOTIFICAR } from "./tipo-mutacoes";
import { INotificacao } from "@/interfaces/INotificacao";
import { ALTERAR_PROJETOS, CADASTRAR_PROJETOS, CADASTRAR_TAREFA, OBTER_PROJETOS, OBTER_TAREFAS, REMOVER_PROJETOS } from "./tipo-acoes";
import http from "@/http";
import ITarefa from "@/interfaces/ITarefa";

interface Estado {
    projetos: IProjeto[],
    notificacoes: INotificacao[],
    tarefas: ITarefa[]
}

export const key: InjectionKey<Store<Estado>> = Symbol()

export const store = createStore<Estado>({
    state: {
        projetos: [],
        notificacoes: [],
        tarefas: [],
    },
    mutations: {
        [ADICIONA_PROJETO](state, nomeDoProjeto: string) {
            const projeto = {
                id: new Date().toISOString(),
                nome: nomeDoProjeto
            } as IProjeto
            state.projetos.push(projeto)
        },
        [ALTERA_PROJETO](state, projeto: IProjeto) {
            const index = state.projetos.findIndex(proj => proj.id == projeto.id)
            state.projetos[index] = projeto
        },
        [EXCLUIR_PROJETO](state, id: string) {
            state.projetos = state.projetos.filter(proj => proj.id != id)
        },
        [DEFINIR_PROJETOS](state, projetos: IProjeto[]) {
            state.projetos = projetos
        },
        [DEFINIR_TAREFAS](state, tarefas: ITarefa[]) {
            state.tarefas = tarefas
        },
        [NOTIFICAR] (state, novaNotificacao: INotificacao) {

            novaNotificacao.id = new Date().getTime()
            state.notificacoes.push(novaNotificacao)

            setTimeout(() => {
                state.notificacoes = state.notificacoes.filter(notificacao => notificacao.id != novaNotificacao.id)
            }, 3000)
        },
        [ADICIONA_TAREFA](state, tarefa: ITarefa) {

            state.tarefas.push(tarefa)
        },
    },
    actions: {
        [OBTER_PROJETOS] ({ commit }) {
            http.get('projetos')
                .then(response => commit(DEFINIR_PROJETOS, response.data))
        },
        [CADASTRAR_PROJETOS] (contexto, nomeDoProjeto: string) {
            return http.post('/projetos', {
                nome: nomeDoProjeto
            })
        },
        [ALTERAR_PROJETOS] (contexto, projeto: IProjeto) {
            return http.put(`/projetos/${projeto.id}`, projeto)
        },
        [REMOVER_PROJETOS] ({ commit }, id: string) {
            return http.delete(`/projetos/${id}`)
                .then(() => commit(EXCLUIR_PROJETO, id) )
        },
        [OBTER_TAREFAS] ({ commit }) {
            http.get('tarefas')
                .then(response => commit(DEFINIR_TAREFAS, response.data))
        },
        [CADASTRAR_TAREFA] ({commit}, tarefa: ITarefa) {
            return http.post('/tarefas', tarefa)
                .then(response => commit(ADICIONA_TAREFA, response.data))
        },
        
    }
})

export function useStore(): Store<Estado> {
    return vuexUseStore(key) 
}