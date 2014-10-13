class ClicksController < ApplicationController

  def index
    @clicks = Click.all
    render layout: 'layouts/application'
  end


  def show


    Click.create!(:token => params[:token], :ip => request.remote_ip)

    redirect_to :back

  end

end
