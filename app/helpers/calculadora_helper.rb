module CalculadoraHelper
  def calcular_aliquota(salario)
    faixas_contribuicao = FaixaContribuicao.all
    aliquota = 0
    calculo = 0
    faixas_contribuicao.each do |faixa|
      valor_calculo = salario
      valor_calculo = faixa.max if salario >= faixa.min && salario >= faixa.max
      calculo = (valor_calculo - faixa.min) * faixa.aliquota
      aliquota += calculo if calculo.positive?
    end
    aliquota
  end
end
