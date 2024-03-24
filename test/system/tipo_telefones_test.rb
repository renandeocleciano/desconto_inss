require "application_system_test_case"

class TipoTelefonesTest < ApplicationSystemTestCase
  setup do
    @tipo_telefone = tipo_telefones(:one)
  end

  test "visiting the index" do
    visit tipo_telefones_url
    assert_selector "h1", text: "Tipo telefones"
  end

  test "should create tipo telefone" do
    visit tipo_telefones_url
    click_on "New tipo telefone"

    fill_in "Descricao", with: @tipo_telefone.descricao
    click_on "Create Tipo telefone"

    assert_text "Tipo telefone was successfully created"
    click_on "Back"
  end

  test "should update Tipo telefone" do
    visit tipo_telefone_url(@tipo_telefone)
    click_on "Edit this tipo telefone", match: :first

    fill_in "Descricao", with: @tipo_telefone.descricao
    click_on "Update Tipo telefone"

    assert_text "Tipo telefone was successfully updated"
    click_on "Back"
  end

  test "should destroy Tipo telefone" do
    visit tipo_telefone_url(@tipo_telefone)
    click_on "Destroy this tipo telefone", match: :first

    assert_text "Tipo telefone was successfully destroyed"
  end
end
