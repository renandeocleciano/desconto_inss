# frozen_string_literal: true

require 'test_helper'

class TipoTelefonesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @tipo_telefone = tipo_telefones(:one)
  end

  test 'should get index' do
    get tipo_telefones_url
    assert_response :success
  end

  test 'should get new' do
    get new_tipo_telefone_url
    assert_response :success
  end

  test 'should create tipo_telefone' do
    assert_difference('TipoTelefone.count') do
      post tipo_telefones_url, params: { tipo_telefone: { descricao: @tipo_telefone.descricao } }
    end

    assert_redirected_to tipo_telefone_url(TipoTelefone.last)
  end

  test 'should show tipo_telefone' do
    get tipo_telefone_url(@tipo_telefone)
    assert_response :success
  end

  test 'should get edit' do
    get edit_tipo_telefone_url(@tipo_telefone)
    assert_response :success
  end

  test 'should update tipo_telefone' do
    patch tipo_telefone_url(@tipo_telefone), params: { tipo_telefone: { descricao: @tipo_telefone.descricao } }
    assert_redirected_to tipo_telefone_url(@tipo_telefone)
  end

  test 'should destroy tipo_telefone' do
    assert_difference('TipoTelefone.count', -1) do
      delete tipo_telefone_url(@tipo_telefone)
    end

    assert_redirected_to tipo_telefones_url
  end
end
