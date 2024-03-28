class CalculadoraController < ApplicationController
include CalculadoraHelper
  # GET /proponentes
  def index
    salario = params[:salario].to_f
    aliquota = calcular_aliquota(salario)
    json_string = { 'aliquota' => aliquota.round(2).to_s, 'salario_liquido' => (salario - aliquota).round(2) }.to_json
    respond_to do |format|
      format.json { render json: json_string }
    end
  end
end
