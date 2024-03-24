class CalculadoraController < ApplicationController
  # GET /proponentes
  def index
    salario = params[:salario].to_f
    faixas_contribuicao = FaixaContribuicao.all
    aliquota = 0
    calculo = 0
    faixas_contribuicao.each do |faixa|
      valor_calculo = salario
      valor_calculo = faixa.max if salario >= faixa.min && salario >= faixa.max
      calculo = (valor_calculo - faixa.min) * faixa.aliquota
      aliquota += calculo if calculo.positive?
    end
    json_string = { 'aliquota' => aliquota.round(2).to_s, 'salario_liquido' => (salario - aliquota).round(2) }.to_json
    respond_to do |format|
      format.json { render json: json_string }
    end
  end
end
