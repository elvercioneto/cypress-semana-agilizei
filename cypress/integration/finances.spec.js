/// <reference types="cypress" /> //trazer informações sobres os comandss (cy.get) por exemplo

import { format, prepareLocalStorage} from '../support/utils'


context('Dev Finances Agilizei', () => {

    //hooks
    //são trechos de código que executam antes e depois do teste
        //before - antes de todos os testes
        //beforeEach - antes de cada teste
        //after - depois de todos os testes
        //afterEach

    beforeEach(() => {
        cy.visit('https://devfinance-agilizei.netlify.app', {
            onBeforeLoad: (win) => {
                prepareLocalStorage(win)
            }

        });
            

    })
    it('Cadastrar entradas', () => {
        //entender o fluxo manualmente
        //mapear os elementos
        //escrever as interações com  o cypress
        //adicionar as asserções que a gente precisa

        cy.get('#transaction .button').click() //id + classe
        cy.get('#description').type('Mesada')
        cy.get('[name=amount]').type(12) //atributos
        cy.get('[type=date]').type('2021-03-17')
        cy.get('button').contains('Salvar').click() //tipo e valor

        cy.get('#data-table tbody tr').should('have.length', 3)


    });

    it('Cadastrar saídas', () => {
        

        cy.get('#transaction .button').click() //id + classe
        cy.get('#description').type('Presente')
        cy.get('[name=amount]').type(-12) //atributos
        cy.get('[type=date]').type('2021-03-21')
        cy.get('button').contains('Salvar').click() //tipo e valor

        cy.get('#data-table tbody tr').should('have.length', 3)
        
    });
    
it('Remover entradas e saídas', () => {
    const entrada = 'Total'
    const saida = 'KinderOvo'    
    
  

    //estrategia 1: voltar pro elemento pai(tr) e avançar para um td img attr
    
    cy.get('td.description')
        .contains("Mesada")
        .parent()
        .find('img[onclick*=remove]')
        .click()


        //estrategia 2: BUSCAR todos os irmãos e buscar o que tem img + attr

    cy.get('td.description')
        .contains("Suco Kapo")
        .siblings()
        .children('img[onclick*=remove]')
        .click()

    cy.get('#data-table tbody tr').should('have.length', 0)

    });

    it('Validar saldo com diversas transações', () => {
        
    const entrada = 'Total'
    const saida = 'KinderOvo' 

               
        //capturar as linhas com as transações e as colunas com valores
        //capturar o texto dessas colunas
        //formatar esses valores das linhas

        //somar os valores de entradas e saidas
        //capturar o texto do total
        //comparar o somatório de entradas e despesas com o total

        let incomes = 0
        let expenses = 0

        cy.get('#data-table tbody tr')
            .each(($el, index, $list) => {
                //cy.log(index) 

                cy.get($el).find('td.income, td.expense').invoke('text').then(text => {
                    //cy.log(text)
                    //cy.log(format(text))
                    if(text.includes('-')){
                        expenses = expenses + format(text)
                    } else {
                        incomes = incomes + format(text)
                    }

                    
                    cy.log(`entradas`,incomes)
                    cy.log(`saídas`, expenses)

                    })

            })

            cy.get('#totalDisplay').invoke('text').then(text => {
                //cy.log(`valor total`, format(text) )
                let formattedTotalDisplay = format(text)
                let expectedTotal = incomes + expenses

                expect(formattedTotalDisplay).to.eq(expectedTotal)

            })
    });
       

});