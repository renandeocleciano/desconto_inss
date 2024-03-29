class DashboardController < ApplicationController
  def index; end

  def proponentes
    proponentes = Proponente.group(:faixa).count.as_json
    respond_to do |format|
      format.json { render json: proponentes }
    end
  end
end