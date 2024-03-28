# frozen_string_literal: true

class ProponentesController < ApplicationController
  before_action :set_proponente, only: %i[show edit update destroy]

  # GET /proponentes or /proponentes.json
  def index
    @proponentes = Proponente.page(params[:page]).per(5)
  end

  # GET /proponentes/1 or /proponentes/1.json
  def show; end

  # GET /proponentes/new
  def new
    @proponente = Proponente.new
  end

  # GET /proponentes/1/edit
  def edit; end

  # POST /proponentes or /proponentes.json
  def create
    @proponente = Proponente.new(proponente_params)

    respond_to do |format|
      if @proponente.save
        AtualizarSalarioJob.perform_async(@proponente.id)
        format.html { redirect_to proponente_url(@proponente), notice: 'Proponente was successfully created.' }
        format.json { render :show, status: :created, location: @proponente }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @proponente.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /proponentes/1 or /proponentes/1.json
  def update
    respond_to do |format|
      if @proponente.update(proponente_params)
        AtualizarSalarioJob.perform_async(@proponente.id)
        format.html { redirect_to proponente_url(@proponente), notice: 'Proponente was successfully updated.' }
        format.json { render :show, status: :ok, location: @proponente }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @proponente.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /proponentes/1 or /proponentes/1.json
  def destroy
    @proponente.destroy!

    respond_to do |format|
      format.html { redirect_to proponentes_url, notice: 'Proponente was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_proponente
    @proponente = Proponente.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def proponente_params
    params.require(:proponente).permit(:nome, :cpf, :data_nascimento, :salario, :recolhido)
  end
end
