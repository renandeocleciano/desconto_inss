# frozen_string_literal: true

require 'application_system_test_case'

class FaixaContribuicaosTest < ApplicationSystemTestCase
  setup do
    @faixa_contribuicao = faixa_contribuicaos(:one)
  end

  test 'visiting the index' do
    visit faixa_contribuicaos_url
    assert_selector 'h1', text: 'Faixa contribuicaos'
  end

  test 'should create faixa contribuicao' do
    visit faixa_contribuicaos_url
    click_on 'New faixa contribuicao'

    fill_in 'Aliquota', with: @faixa_contribuicao.aliquota
    fill_in 'Max', with: @faixa_contribuicao.max
    fill_in 'Min', with: @faixa_contribuicao.min
    click_on 'Create Faixa contribuicao'

    assert_text 'Faixa contribuicao was successfully created'
    click_on 'Back'
  end

  test 'should update Faixa contribuicao' do
    visit faixa_contribuicao_url(@faixa_contribuicao)
    click_on 'Edit this faixa contribuicao', match: :first

    fill_in 'Aliquota', with: @faixa_contribuicao.aliquota
    fill_in 'Max', with: @faixa_contribuicao.max
    fill_in 'Min', with: @faixa_contribuicao.min
    click_on 'Update Faixa contribuicao'

    assert_text 'Faixa contribuicao was successfully updated'
    click_on 'Back'
  end

  test 'should destroy Faixa contribuicao' do
    visit faixa_contribuicao_url(@faixa_contribuicao)
    click_on 'Destroy this faixa contribuicao', match: :first

    assert_text 'Faixa contribuicao was successfully destroyed'
  end
end
