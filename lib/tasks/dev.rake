namespace :dev do
  desc "Configura o ambiente de desenvolvimento"
  task setup: :environment do
    if Rails.env.development?
      show_spinner("Apagando DB...") { %x(rails db:drop) } 

      show_spinner("Criando DB...") { %x(rails db:create) }

      show_spinner("Migrando DB...") { %x(rails db:migrate) }

      show_spinner("Populando DB...") { %x(rails db:seed) }
    else 
      puts "Taks não configurada para o ambiente informado"
    end
  end

  private

  def show_spinner(msg_inicio, msg_final = "Concluido!")
    spinner = TTY::Spinner.new("[:spinner] #{msg_inicio}")
    spinner.auto_spin
    yield
    spinner.success("(#{msg_final})")
  end
end