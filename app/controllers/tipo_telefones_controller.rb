# frozen_string_literal: true

class TipoTelefonesController < ApplicationController
  before_action :set_tipo_telefone, only: %i[show edit update destroy]

  # GET /tipo_telefones or /tipo_telefones.json
  def index
    @tipo_telefones = TipoTelefone.all
  end

  # GET /tipo_telefones/1 or /tipo_telefones/1.json
  def show; end

  # GET /tipo_telefones/new
  def new
    @tipo_telefone = TipoTelefone.new
  end

  # GET /tipo_telefones/1/edit
  def edit; end

  # POST /tipo_telefones or /tipo_telefones.json
  def create
    @tipo_telefone = TipoTelefone.new(tipo_telefone_params)

    respond_to do |format|
      if @tipo_telefone.save
        format.html { redirect_to tipo_telefone_url(@tipo_telefone), notice: 'Tipo telefone was successfully created.' }
        format.json { render :show, status: :created, location: @tipo_telefone }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @tipo_telefone.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /tipo_telefones/1 or /tipo_telefones/1.json
  def update
    respond_to do |format|
      if @tipo_telefone.update(tipo_telefone_params)
        format.html { redirect_to tipo_telefone_url(@tipo_telefone), notice: 'Tipo telefone was successfully updated.' }
        format.json { render :show, status: :ok, location: @tipo_telefone }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @tipo_telefone.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /tipo_telefones/1 or /tipo_telefones/1.json
  def destroy
    @tipo_telefone.destroy!

    respond_to do |format|
      format.html { redirect_to tipo_telefones_url, notice: 'Tipo telefone was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_tipo_telefone
    @tipo_telefone = TipoTelefone.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def tipo_telefone_params
    params.require(:tipo_telefone).permit(:descricao)
  end
end
