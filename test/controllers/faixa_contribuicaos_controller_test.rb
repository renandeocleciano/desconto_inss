# frozen_string_literal: true

require 'test_helper'

class FaixaContribuicaosControllerTest < ActionDispatch::IntegrationTest
  setup do
    @faixa_contribuicao = faixa_contribuicaos(:one)
  end

  test 'should get index' do
    get faixa_contribuicaos_url
    assert_response :success
  end

  test 'should get new' do
    get new_faixa_contribuicao_url
    assert_response :success
  end

  test 'should create faixa_contribuicao' do
    assert_difference('FaixaContribuicao.count') do
      post faixa_contribuicaos_url,
           params: { faixa_contribuicao: { aliquota: @faixa_contribuicao.aliquota, max: @faixa_contribuicao.max,
                                           min: @faixa_contribuicao.min } }
    end

    assert_redirected_to faixa_contribuicao_url(FaixaContribuicao.last)
  end

  test 'should show faixa_contribuicao' do
    get faixa_contribuicao_url(@faixa_contribuicao)
    assert_response :success
  end

  test 'should get edit' do
    get edit_faixa_contribuicao_url(@faixa_contribuicao)
    assert_response :success
  end

  test 'should update faixa_contribuicao' do
    patch faixa_contribuicao_url(@faixa_contribuicao),
          params: { faixa_contribuicao: { aliquota: @faixa_contribuicao.aliquota, max: @faixa_contribuicao.max,
                                          min: @faixa_contribuicao.min } }
    assert_redirected_to faixa_contribuicao_url(@faixa_contribuicao)
  end

  test 'should destroy faixa_contribuicao' do
    assert_difference('FaixaContribuicao.count', -1) do
      delete faixa_contribuicao_url(@faixa_contribuicao)
    end

    assert_redirected_to faixa_contribuicaos_url
  end
end
