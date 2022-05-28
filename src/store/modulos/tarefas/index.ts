import { Module } from 'vuex';
import ITarefa from "@/interfaces/ITarefa";
import { Estado } from '@/store';
import http from '@/http';
import { OBTER_TAREFA, CADASTRAR_TAREFA, ALTERAR_TAREFA } from '@/store/tipo-acoes';
import { DEFINIR_TAREFA, ADICIONA_TAREFA, ALTERA_TAREFA } from '@/store/tipo-mutacoes';

export interface EstadoTarefa {
    tarefas: ITarefa[]
}

export const tarefa: Module<EstadoTarefa, Estado> = {
    state: {
        tarefas: [],
    },
    mutations: {
        [DEFINIR_TAREFA](state, tarefas: ITarefa[]) {
            state.tarefas = tarefas
        },
        [ADICIONA_TAREFA](state, tarefa: ITarefa) {
            state.tarefas.push(tarefa)
        },
        [ALTERA_TAREFA](state, tarefa: ITarefa) {
            const index = state.tarefas.findIndex(t => t.id == tarefa.id)
            state.tarefas[index] = tarefa
        },
    },
    actions: {
        [OBTER_TAREFA]({ commit }) {
            http.get('tarefas')
                .then(response => commit(DEFINIR_TAREFA, response.data))
        },
        [CADASTRAR_TAREFA]({ commit }, tarefa: ITarefa) {
            return http.post('/tarefas', tarefa)
                .then(response => commit(ADICIONA_TAREFA, response.data))
        },
        [ALTERAR_TAREFA]({ commit }, tarefa: ITarefa) {
            return http.put(`/tarefas/${tarefa.id}`, tarefa)
                .then(() => commit(ALTERAR_TAREFA, tarefa))
        },
    }
}