class FaixaContribuicaosController < ApplicationController
  before_action :set_faixa_contribuicao, only: %i[ show edit update destroy ]

  # GET /faixa_contribuicaos or /faixa_contribuicaos.json
  def index
    @faixa_contribuicaos = FaixaContribuicao.all
  end

  # GET /faixa_contribuicaos/1 or /faixa_contribuicaos/1.json
  def show
  end

  # GET /faixa_contribuicaos/new
  def new
    @faixa_contribuicao = FaixaContribuicao.new
  end

  # GET /faixa_contribuicaos/1/edit
  def edit
  end

  # POST /faixa_contribuicaos or /faixa_contribuicaos.json
  def create
    @faixa_contribuicao = FaixaContribuicao.new(faixa_contribuicao_params)

    respond_to do |format|
      if @faixa_contribuicao.save
        format.html { redirect_to faixa_contribuicao_url(@faixa_contribuicao), notice: "Faixa contribuicao was successfully created." }
        format.json { render :show, status: :created, location: @faixa_contribuicao }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @faixa_contribuicao.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /faixa_contribuicaos/1 or /faixa_contribuicaos/1.json
  def update
    respond_to do |format|
      if @faixa_contribuicao.update(faixa_contribuicao_params)
        format.html { redirect_to faixa_contribuicao_url(@faixa_contribuicao), notice: "Faixa contribuicao was successfully updated." }
        format.json { render :show, status: :ok, location: @faixa_contribuicao }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @faixa_contribuicao.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /faixa_contribuicaos/1 or /faixa_contribuicaos/1.json
  def destroy
    @faixa_contribuicao.destroy!

    respond_to do |format|
      format.html { redirect_to faixa_contribuicaos_url, notice: "Faixa contribuicao was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_faixa_contribuicao
      @faixa_contribuicao = FaixaContribuicao.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def faixa_contribuicao_params
      params.require(:faixa_contribuicao).permit(:min, :max, :aliquota)
    end
end
