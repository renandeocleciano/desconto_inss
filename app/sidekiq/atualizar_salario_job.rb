# frozen_string_literal: true

class AtualizarSalarioJob
  include Sidekiq::Job

  def perform(id)
    proponente = Proponente.find(id)
    aliquota = CalculadoraController.helpers.calcular_aliquota(proponente.salario)
    proponente.recolhido = aliquota
    proponente.faixa = obter_faixa(proponente.salario)
    proponente.save
  end

  private

  def obter_faixa(salario)
    if salario <= 1045
      1
    elsif (salario > 1045) && (salario <= 2089.60)
      2
    elsif (salario > 2089.60) && (salario <= 3134.60)
      3
    else
      4
    end
  end
end
