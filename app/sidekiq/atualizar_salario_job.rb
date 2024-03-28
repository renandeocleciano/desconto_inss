class AtualizarSalarioJob
  include Sidekiq::Job

  def perform(id)
    proponente = Proponente.find(id)
    aliquota = CalculadoraController.helpers.calcular_aliquota(proponente.salario)
    proponente.recolhido = aliquota
    proponente.save
  end
end
