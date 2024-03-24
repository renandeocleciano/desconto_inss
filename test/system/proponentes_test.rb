# frozen_string_literal: true

require 'application_system_test_case'

class ProponentesTest < ApplicationSystemTestCase
  setup do
    @proponente = proponentes(:one)
  end

  test 'visiting the index' do
    visit proponentes_url
    assert_selector 'h1', text: 'Proponentes'
  end

  test 'should create proponente' do
    visit proponentes_url
    click_on 'New proponente'

    fill_in 'Cpf', with: @proponente.cpf
    fill_in 'Data nascimento', with: @proponente.data_nascimento
    fill_in 'Nome', with: @proponente.nome
    fill_in 'Recolhido', with: @proponente.recolhido
    fill_in 'Salario', with: @proponente.salario
    click_on 'Create Proponente'

    assert_text 'Proponente was successfully created'
    click_on 'Back'
  end

  test 'should update Proponente' do
    visit proponente_url(@proponente)
    click_on 'Edit this proponente', match: :first

    fill_in 'Cpf', with: @proponente.cpf
    fill_in 'Data nascimento', with: @proponente.data_nascimento
    fill_in 'Nome', with: @proponente.nome
    fill_in 'Recolhido', with: @proponente.recolhido
    fill_in 'Salario', with: @proponente.salario
    click_on 'Update Proponente'

    assert_text 'Proponente was successfully updated'
    click_on 'Back'
  end

  test 'should destroy Proponente' do
    visit proponente_url(@proponente)
    click_on 'Destroy this proponente', match: :first

    assert_text 'Proponente was successfully destroyed'
  end
end
